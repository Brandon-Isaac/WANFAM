# Repository settings and guidelines

## Pull Request Requirements

### Mandatory Requirements
All pull requests to this repository MUST:

1. **Pass all automated checks** - The PR validation workflow must complete successfully
2. **Receive at least 1 approval** - From a code owner or designated reviewer
3. **Have a descriptive title** - At least 10 characters explaining the change
4. **Include proper description** - Using the provided PR template
5. **Resolve all conversations** - All review comments must be addressed

### Branch Protection Rules
The following rules are enforced on the `main` branch:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require conversation resolution before merging
- ✅ Dismiss stale reviews when new commits are pushed
- ❌ No force pushes allowed
- ❌ No deletions allowed

### Automated Features
- **Smart reviewer assignment**: Automatically assigns reviewers based on CODEOWNERS and repository variables
- **Auto-labeling**: PRs are labeled based on changed files
- **Validation**: Code quality and specific file format checks
- **Templates**: Standardized PR templates guide contributors
- **Flexible configuration**: No single points of failure, easily scalable reviewer management

## Reviewer Assignment

This repository uses an intelligent reviewer assignment system:

1. **CODEOWNERS-based**: Reviewers are assigned based on files changed
2. **Configurable fallbacks**: Repository variables provide backup reviewers
3. **Smart filtering**: PR authors are excluded, limits are respected
4. **Multi-team support**: Different teams can own different parts of the codebase

For detailed information about reviewer management, see [REVIEWER-MANAGEMENT.md](REVIEWER-MANAGEMENT.md).

## Getting Started

### Creating a Pull Request

1. **Fork the repository** (for external contributors)
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following the project guidelines
4. **Test your changes** locally
5. **Commit with clear messages**: `git commit -m "feat: add user profile validation"`
6. **Push to your branch**: `git push origin feature/your-feature-name`
7. **Create a pull request** using the provided template

### Review Process

1. **Automated checks** run immediately when PR is created
2. **Code owners** are automatically notified and assigned as reviewers
3. **Review and feedback** - Reviewers will provide feedback and suggestions
4. **Address feedback** - Make requested changes and push new commits
5. **Final approval** - Once approved and all checks pass, PR can be merged

## File-Specific Requirements

### User Data Files (`users/*.yml`)
- Must contain `linkedin:` field
- Must contain `github:` field
- Valid YAML format required

### Frontend Changes (`frontend/`)
- Follow React best practices
- Include appropriate tests
- Update documentation if needed

### Backend Changes (`backend/`)
- Follow API design patterns
- Include unit tests
- Update API documentation

## Contact

For questions about the review process or repository guidelines, please:
- Open an issue for general questions
- Check [REVIEWER-MANAGEMENT.md](REVIEWER-MANAGEMENT.md) for reviewer configuration
- Contact code owners for area-specific questions (see CODEOWNERS file)
- Check existing documentation and PRs for examples
