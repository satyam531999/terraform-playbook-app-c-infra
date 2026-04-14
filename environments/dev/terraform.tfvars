aws_region      = "us-east-1"
name_prefix     = "prodlab-dev"
desired_count   = 1
container_image = "140023367958.dkr.ecr.us-east-1.amazonaws.com/observable-demo-app:1.0.0-23da6fa"

# Dynatrace integration values
enable_dynatrace          = true
dynatrace_aws_account_arn = "arn:aws:iam::314146291599:root"
dynatrace_external_id     = "vu9U3hXa3q0AAAABADJidWlsdGluOmh5cGVyc2NhbGVyLWF1dGhlbnRpY2F0aW9uLmNvbm5lY3Rpb25zLmF3cwAGdGVuYW50AAZ0ZW5hbnQAJDllNWZhOWM0LWFiY2QtMzFhZC04NThiLTEyNTZjNDdlNjQ0Zr7vVN4V2t6t"
dynatrace_api_url         = "https://tsc94425.apps.dynatrace.com/api"
dynatrace_api_token       = ""
