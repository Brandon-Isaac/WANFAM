#!/bin/bash

# Script to manually set up branch protection rules
# Run this if the automated workflow doesn't work due to permissions

echo "Setting up branch protection for WANFAM repository..."

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first:"
    echo "https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "Please authenticate with GitHub CLI first:"
    echo "gh auth login"
    exit 1
fi

echo "Setting up branch protection rules for 'main' branch..."

# Enable branch protection with required reviews
gh api repos/:owner/:repo/branches/master/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["validate-changes"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true

echo "✅ Branch protection rules have been set up successfully!"
echo ""
echo "Current protection rules:"
echo "- Require 1 approving review"
echo "- Require status checks (validate-changes)"
echo "- Require code owner reviews"
echo "- Dismiss stale reviews"
echo "- Require conversation resolution"
echo "- Block force pushes and deletions"
