-- Update sync_mock_examples function to also extract postResponseScript
CREATE OR REPLACE FUNCTION sync_mock_examples()
RETURNS TRIGGER AS $$
BEGIN
  NEW."mockExamples" := jsonb_build_object(
    'examples',
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'key', key,
            'name', value->>'name',
            'endpoint', value->'originalRequest'->>'endpoint',
            'method', value->'originalRequest'->>'method',
            'headers', COALESCE(value->'originalRequest'->'headers', '[]'::jsonb),
            'statusCode', (value->>'code')::int,
            'statusText', value->>'status',
            'responseBody', value->>'body',
            'responseHeaders', COALESCE(value->'headers', '[]'::jsonb),
            'postResponseScript', COALESCE(value->>'postResponseScript', '')
          )
        )
        FROM jsonb_each(NEW.request->'responses') AS responses(key, value)
        WHERE jsonb_typeof(NEW.request->'responses') = 'object'
      ),
      '[]'::jsonb
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Backfill existing data for UserRequest
UPDATE "UserRequest" SET request = request WHERE request IS NOT NULL;

-- Backfill existing data for TeamRequest
UPDATE "TeamRequest" SET request = request WHERE request IS NOT NULL;
