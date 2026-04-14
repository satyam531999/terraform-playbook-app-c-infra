aws_region      = "us-east-1"
name_prefix     = "prodlab-prod"
desired_count   = 2
container_image = "public.ecr.aws/nginx/nginx:latest"

# Dynatrace integration values
enable_dynatrace          = false
dynatrace_aws_account_arn = "arn:aws:iam::314146291599:root"
dynatrace_external_id     = "vu9U3hXa3q0AAAABADJidWlsdGluOmh5cGVyc2NhbGVyLWF1dGhlbnRpY2F0aW9uLmNvbm5lY3Rpb25zLmF3cwAGdGVuYW50AAZ0ZW5hbnQAJDllNWZhOWM0LWFiY2QtMzFhZC04NThiLTEyNTZjNDdlNjQ0Zr7vVN4V2t6t"
dynatrace_api_url         = "https://tsc94425.apps.dynatrace.com/api"
dynatrace_api_token       = ""
