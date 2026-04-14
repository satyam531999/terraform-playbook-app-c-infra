# Dev Recreation Plan

This runbook recreates the `dev` environment from `terraform-playbook-app-c-infra` after the previous environment was destroyed.

## Preconditions

- `terraform-playbook-modules` is published and tagged at `v0.1.0`
- `terraform-playbook-common-infra/bootstrap` already owns the backend bucket and lock table
- `terraform-playbook-app-c-infra` repository secrets and variables are configured in GitHub

## Remote State Expectation

The current `dev` backend key is:

- bucket: `tfstate-140023367958-prodlab-20260409`
- key: `terraform/aws-prod-lab/dev/terraform.tfstate`

That state was previously observed as empty after destroy, so recreating `dev` is a clean rebuild, not an in-place migration.

## Safe Rebuild Sequence

1. Run `Terraform CI CD` with `action=plan` and `target_env=dev`.
2. Review the plan and confirm it matches a fresh environment create.
3. Run `Terraform CI CD` with `action=apply`, `target_env=dev`, and `confirm_apply=apply-dev`.
4. After infrastructure is created, run `App Image CI` to build, publish, and deploy the current app image to `dev`.
5. Verify the ALB `/health` endpoint returns the expected `appVersion`.

## Local Alternative

If you want to validate locally first:

1. use `backend.hcl` in `environments/dev`
2. run `terraform init -backend-config=backend.hcl -reconfigure`
3. run `terraform plan`
4. only apply after the plan matches expectations

## Post-Rebuild Checks

- `terraform state list` returns managed resources
- ECS cluster and service exist and are active
- ALB health checks succeed
- `terraform output` returns the expected `alb_dns_name`

## Do Not Do During First Rebuild

- do not change backend keys
- do not retag modules during the same rebuild
- do not mix local manual apply and GitHub Actions apply without reviewing the remote state first