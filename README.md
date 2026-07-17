# TVETUpload

TypeScript monorepo (npm workspaces).

- **frontend/** — Vite + React + TypeScript
- **backend/** — Express + TypeScript, `pg` (node-postgres) against PostgreSQL

## Prerequisites

- Node.js >= 20 (see `.nvmrc` — `nvm use`)
- A running PostgreSQL instance

## Getting started

```bash
# 1. Install all workspace dependencies (run from the repo root)
npm install

# 2. Configure the backend environment
cp backend/.env.example backend/.env
#    then edit backend/.env and set DATABASE_URL

# 3. Start both apps (frontend + backend) together
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:3000 (health check at `/health`)

The frontend dev server proxies requests starting with `/api` to the backend,
so client code can call `/api/...` directly without CORS configuration.

## Scripts (run from the repo root)

| Command | Description |
| --- | --- |
| `npm run dev` | Run frontend and backend in watch mode |
| `npm run build` | Build both packages |
| `npm run typecheck` | Type-check both packages |
| `npm run lint` | Lint both packages |

## Deployment

**Architecture:** the backend (Express API) runs on a single-instance
Elastic Beanstalk environment; the frontend (Vite build) is a static site in
S3 served through CloudFront, which also proxies `/api/*` to the EB
environment. Because both live under the same CloudFront domain, the
frontend keeps calling a relative `/api/...` path in production — same as
the Vite dev proxy — with no CORS configuration needed. Postgres runs on a
standalone RDS instance so its data survives EB environment rebuilds.

```
Browser
  │  https://<cloudfront-domain>
  ▼
CloudFront
  ├─ default behavior (/*)     → S3 bucket (frontend static build)
  └─ /api/* behavior           → Elastic Beanstalk (Express API)
                                        │
                                        ▼
                                  RDS Postgres
```

All of it is defined in [infra/](infra/) as Terraform. Terraform provisions
the AWS resources; GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
builds and deploys the app to them on every push to `main`.

### One-time infrastructure setup

1. Install [Terraform](https://developer.hashicorp.com/terraform/install) and configure AWS credentials locally (e.g. `aws configure`) for the account you're deploying into.
2. `cd infra && cp terraform.tfvars.example terraform.tfvars` and fill in a real `db_password` (don't commit this file — it's gitignored).
3. `terraform init && terraform apply`. This creates the RDS instance, EB application/environment, S3 bucket, CloudFront distribution, and an IAM role that GitHub Actions can assume via OIDC.
4. Copy the Terraform outputs into the GitHub repo's **Settings → Secrets and variables → Actions → Variables**:

   | Terraform output | GitHub Actions variable |
   | --- | --- |
   | `github_actions_role_arn` | `AWS_ROLE_ARN` |
   | (same value as in `terraform.tfvars`) | `AWS_REGION` |
   | `eb_application_name` | `EB_APPLICATION_NAME` |
   | `eb_environment_name` | `EB_ENVIRONMENT_NAME` |
   | `eb_storage_bucket_name` | `EB_STORAGE_BUCKET` |
   | `frontend_bucket_name` | `FRONTEND_S3_BUCKET` |
   | `cloudfront_distribution_id` | `CLOUDFRONT_DISTRIBUTION_ID` |

5. Push to `main`. The `deploy-backend` and `deploy-frontend` jobs build and ship the app; `terraform output site_url` is where it ends up.

### Notes / follow-ups

- Terraform state is local by default (see the commented-out `backend "s3"` block in [infra/versions.tf](infra/versions.tf)) — move it to a remote backend before more than one person runs `terraform apply`.
- `DATABASE_URL` is set as a plaintext EB environment property. Good enough to start; move it to Secrets Manager (referenced via an EB `.ebextensions` hook) if this becomes a real concern.
- The EB environment is `SingleInstance` (no load balancer) to keep cost and setup minimal. Switch to `LoadBalanced` in [infra/eb.tf](infra/eb.tf) if you need zero-downtime deploys or horizontal scaling.
- No custom domain/ACM certificate is set up — the app is served on the default `*.cloudfront.net` domain (CloudFront's own certificate covers HTTPS).
