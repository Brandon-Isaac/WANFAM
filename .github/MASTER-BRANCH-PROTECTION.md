# Master Branch Protection Guide

This guide explains how to protect your `master` branch (or any default branch) in the WANFAM repository.

## 🔒 **Quick Setup - Protect Master Branch**

### **Option 1: Automated Protection (Recommended)**

1. **Push the updated workflows:**
   ```bash
   git add .github/
   git commit -m "feat: add master branch protection"
   git push origin master  # or main
   ```

2. **Automatic protection activates** when workflows are pushed to master/main

### **Option 2: Manual PowerShell Script**

```powershell
# Navigate to .github directory
cd .github

# Protect master branch only
.\setup-branch-protection.ps1 -Branches @("master")

# Protect both main and master
.\setup-branch-protection.ps1 -Branches @("main", "master")

# Protect master with custom settings
.\setup-branch-protection.ps1 -Branches @("master") -MinReviewers 2 -RequireCodeOwners:$true
```

### **Option 3: GitHub CLI (One-time setup)**

```powershell
# Install GitHub CLI if not already installed
# winget install GitHub.cli

# Authenticate
gh auth login

# Enable branch protection for master
gh api repos/:owner/:repo/branches/master/protection `
  --method PUT `
  --field required_status_checks='{"strict":true,"contexts":["validate-changes"]}' `
  --field enforce_admins=false `
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' `
  --field restrictions=null `
  --field allow_force_pushes=false `
  --field allow_deletions=false `
  --field required_conversation_resolution=true
```

### **Option 4: GitHub Web Interface**

1. **Go to your repository on GitHub**
2. **Click Settings tab**
3. **Click Branches in left sidebar**
4. **Click "Add rule" or edit existing rule**
5. **Enter branch name pattern:** `master`
6. **Enable these protections:**
   - ✅ Require a pull request before merging
   - ✅ Require approvals (set to 1 or more)
   - ✅ Dismiss stale PR approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Include administrators (optional)
7. **Click Create/Save**

## 🛡️ **What Protection Rules Are Applied**

When you protect the master branch, these rules are enforced:

### **Pull Request Requirements**
- ✅ **All changes must go through Pull Requests**
- ✅ **At least 1 approval required** from code owners
- ✅ **Stale reviews dismissed** when new commits pushed
- ✅ **All conversations must be resolved**

### **Status Check Requirements**
- ✅ **`validate-changes` check must pass** (from pr-validation.yml)
- ✅ **Branch must be up-to-date** with master
- ✅ **No merge conflicts allowed**

### **Security Restrictions**
- ❌ **No force pushes** (preserves git history)
- ❌ **No branch deletion** (prevents accidental removal)
- ❌ **No direct commits** to master (PRs only)

## 🔄 **How It Works With Your Current Setup**

### **PR Validation Workflow**
Now triggers on PRs targeting:
- `main` branch
- `master` branch ← **NEW**
- `develop` branch

### **Auto-Reviewer Assignment**
Works the same for all protected branches:
- Reads CODEOWNERS file
- Assigns appropriate reviewers
- Adds relevant labels

### **Branch Protection Workflow**
Automatically protects both:
- `main` branch (if it exists)
- `master` branch (if it exists) ← **NEW**

## 🔍 **Verify Protection Is Active**

### **Check via GitHub Web Interface**
1. Go to **Settings** → **Branches**
2. Look for **master** in protected branches list
3. Should show rules like "Require pull request reviews"

### **Check via PowerShell**
```powershell
# View current protection status
gh api repos/:owner/:repo/branches/master/protection
```

### **Test Protection**
Try to push directly to master:
```bash
# This should be BLOCKED
git checkout master
echo "test" >> README.md
git add README.md
git commit -m "test direct push"
git push origin master
# Expected: Error - branch protection rules
```

## 🚨 **Common Issues & Solutions**

### **❌ "Branch not found" Error**
**Cause:** Your default branch might be `main`, not `master`
**Solution:** 
```powershell
# Check which branches exist
gh api repos/:owner/:repo/branches

# Protect the correct branch
.\setup-branch-protection.ps1 -Branches @("main")  # if main is default
.\setup-branch-protection.ps1 -Branches @("master")  # if master is default
```

### **❌ "Insufficient permissions" Error**
**Cause:** You need admin access to the repository
**Solution:** 
- Contact repository admin
- Or get admin permissions added to your account

### **❌ Status checks not working**
**Cause:** Workflows not set up or not running
**Solution:**
1. Ensure workflows are in `.github/workflows/` directory
2. Check Actions tab for workflow runs
3. Verify workflow files have correct syntax

## 📚 **Branch Naming Best Practices**

### **If You're Using Master Branch:**
- Keep using `master` for consistency
- Ensure all team members know the default branch
- Update any documentation that references branch names

### **If You Want to Switch to Main:**
```bash
# Rename master to main (one-time migration)
git branch -m master main
git push -u origin main
git push origin --delete master

# Update default branch in GitHub settings
# Settings → General → Default branch → Change to main
```

## 🎯 **Quick Commands Reference**

```powershell
# Protect master only
.\setup-branch-protection.ps1 -Branches @("master")

# Protect master with 2 reviewers required
.\setup-branch-protection.ps1 -Branches @("master") -MinReviewers 2

# Protect master without requiring code owner reviews
.\setup-branch-protection.ps1 -Branches @("master") -RequireCodeOwners:$false

# Check current protection status
gh api repos/:owner/:repo/branches/master/protection

# List all protected branches
gh api repos/:owner/:repo/branches --jq '.[] | select(.protected==true) | .name'
```

---

**✅ Your master branch is now protected!** All changes must go through pull requests with proper review and validation.
