# Publishing Docker Images to GitHub Container Registry

This document explains how Docker images are published to GitHub Container Registry (GHCR).

## Automatic Publishing

The GitHub Actions workflow (`.github/workflows/docker-publish.yml`) builds and publishes Docker images when:

1. **Version tags**: When you create a tag like `v0.1.0`, it publishes with semantic version tags:
   - `v0.1.0` (exact version)
   - `0.1` (major.minor)
   - `0` (major only)
   - `latest` (if on default branch)
2. **Manual dispatch**: You can trigger the workflow manually from GitHub Actions UI

## Required Permissions

The workflow uses the `GITHUB_TOKEN` which is automatically provided by GitHub Actions. Make sure your repository has the following permissions:

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, ensure:
   - ✅ **Read and write permissions** is selected
   - ✅ **Allow GitHub Actions to create and approve pull requests** (if needed)

## Image Tags

The workflow creates multiple tags for each image:

- `latest` - Points to the latest version (when tag is on default branch or manual dispatch)
- `v0.1.0` - Exact semantic version
- `0.1` - Major.minor version
- `0` - Major version only

## Using Published Images

### Public Repository

If your repository is public, images are automatically public and can be pulled without authentication:

```bash
docker pull ghcr.io/wecangroup/wecan-comply-middleware:latest
```

### Private Repository

If your repository is private, images are private by default. To make them public:

1. Go to your repository on GitHub
2. Click on **Packages** (right sidebar)
3. Click on the package `wecan-comply-middleware`
4. Go to **Package settings**
5. Scroll down to **Danger Zone** → **Change visibility** → **Make public**

Or to use private images, authenticate first:

```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
docker pull ghcr.io/wecangroup/wecan-comply-middleware:latest
```

## Manual Publishing

If you need to publish manually:

```bash
# 1. Build the image
docker build -t ghcr.io/wecangroup/wecan-comply-middleware:latest .

# 2. Create a Personal Access Token (PAT) with `write:packages` permission
# 3. Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# 4. Push the image
docker push ghcr.io/wecangroup/wecan-comply-middleware:latest
```

## Multi-Architecture Support

The workflow builds images for both `linux/amd64` and `linux/arm64` architectures, making them compatible with:
- Intel/AMD processors (amd64)
- Apple Silicon and ARM-based servers (arm64)

## Troubleshooting

### Workflow fails with "permission denied"

- Check that workflow permissions are set to "Read and write"
- Verify that `GITHUB_TOKEN` has `packages: write` permission

### Image not found after publishing

- Wait a few minutes for the image to be processed
- Check the **Packages** section of your repository
- Verify the image name matches: `ghcr.io/wecangroup/wecan-comply-middleware`

### Cannot pull private image

- Make sure you're authenticated: `docker login ghcr.io`
- Verify your token has `read:packages` permission
- Check that the package visibility allows your access

