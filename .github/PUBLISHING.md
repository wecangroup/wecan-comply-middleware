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

### Important: Images are Private by Default

**By default, all images published to GitHub Container Registry are private**, regardless of whether your repository is public or private. You must explicitly make them public to allow unauthenticated pulls.

### Making Images Public

To make your Docker images publicly accessible:

1. Go to your repository on GitHub (e.g., `https://github.com/wecangroup/wecan-comply-middleware`)
2. Click on **Packages** in the right sidebar (or go to `https://github.com/orgs/wecangroup/packages`)
3. Find and click on the package `wecan-comply-middleware`
4. Click on **Package settings** (gear icon on the right)
5. Scroll down to **Danger Zone**
6. Click **Change visibility** → **Make public**
7. Confirm the change

**Note**: You need to be an owner or have admin permissions on the repository/organization to change package visibility.

### Using Private Images (Alternative)

If you prefer to keep images private, authenticate first:

```bash
# Create a Personal Access Token (PAT) with `read:packages` permission
# Then login:
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Now you can pull:
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

## Architecture Support

The workflow builds images for `linux/amd64` architecture, making them compatible with:
- Intel/AMD processors (amd64)
- Most cloud providers and servers

**Note**: ARM64 support can be added later if needed using native ARM64 runners or improved QEMU configuration.

## Troubleshooting

### Workflow fails with "permission denied"

- Check that workflow permissions are set to "Read and write"
- Verify that `GITHUB_TOKEN` has `packages: write` permission

### Image not found after publishing

- Wait a few minutes for the image to be processed
- Check the **Packages** section of your repository
- Verify the image name matches: `ghcr.io/wecangroup/wecan-comply-middleware`

### Cannot pull image - "denied" error

This error means the image is private. You have two options:

1. **Make the image public** (recommended for public repositories):
   - Go to your repository → **Packages** → `wecan-comply-middleware` → **Package settings**
   - Scroll to **Danger Zone** → **Change visibility** → **Make public**

2. **Authenticate to use private images**:
   - Create a Personal Access Token (PAT) with `read:packages` permission
   - Login: `echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin`
   - Then pull: `docker pull ghcr.io/wecangroup/wecan-comply-middleware:latest`

