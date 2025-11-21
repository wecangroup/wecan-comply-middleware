# Publishing Docker Images to GitHub Container Registry

This document explains how Docker images are published to GitHub Container Registry (GHCR).

## Automatic Publishing

The GitHub Actions workflow (`.github/workflows/docker-publish.yml`) builds and publishes Docker images when:

1. **Version tags**: When you create a Git tag like `v0.1.0`, it publishes Docker images
2. **Manual dispatch**: You can trigger the workflow manually from GitHub Actions UI

**Important**: The Docker image tags are automatically generated from the `version` field in `package.json`, not from the Git tag. This ensures consistency between your package version and Docker image tags.

## Required Permissions

The workflow uses the `GITHUB_TOKEN` which is automatically provided by GitHub Actions. Make sure your repository has the following permissions:

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, ensure:
   - ✅ **Read and write permissions** is selected
   - ✅ **Allow GitHub Actions to create and approve pull requests** (if needed)

## Image Tags

The workflow automatically creates multiple tags based on the `version` field in `package.json`. For example, if `package.json` contains `"version": "0.1.0"`, the following tags will be created:

- `v0.1.0` - Version with 'v' prefix (e.g., `v0.1.0`)
- `0.1.0` - Exact version from package.json (e.g., `0.1.0`)
- `0.1` - Major.minor version (e.g., `0.1`)
- `0` - Major version only (e.g., `0`)
- `latest` - Always points to the latest published version

**Note**: To update the Docker image version, update the `version` field in `package.json` and commit the change before triggering the workflow.

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

### Cannot pull image - "denied" or "UNAUTHORIZED" error

**Important**: Even if the package is marked as public, accessing the manifest API directly in a browser (`https://ghcr.io/v2/.../manifests/...`) will return "UNAUTHORIZED". This is **normal behavior** - GitHub Container Registry requires authentication for API access, but Docker can pull public images without authentication.

**Solutions**:

1. **Verify package visibility**:
   - Go to your repository → **Packages** → `wecan-comply-middleware` → **Package settings`
   - Ensure it shows "This package is currently public"

2. **Logout from Docker (if authenticated)**:
   - If you're logged in to GHCR, logout first: `docker logout ghcr.io`
   - Then try pulling: `docker pull ghcr.io/wecangroup/wecan-comply-middleware:latest`

3. **Wait for propagation**:
   - After making a package public, it can take 5-10 minutes for changes to propagate globally

4. **Test Docker pull directly**:
   ```bash
   # Logout first to ensure no cached credentials interfere
   docker logout ghcr.io
   
   # Then try pulling (should work without auth for public packages)
   docker pull ghcr.io/wecangroup/wecan-comply-middleware:latest
   ```

5. **If Docker pull still fails, authenticate**:
   - Create a Personal Access Token (PAT) with `read:packages` permission
   - Login: `echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin`
   - Then pull: `docker pull ghcr.io/wecangroup/wecan-comply-middleware:latest`

**Note**: The "UNAUTHORIZED" error when accessing manifests via browser/API is expected and doesn't mean the package is private. Docker should be able to pull public images without authentication.

