# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[//]: # (## [Unreleased])

## [0.4.1] - 2025-08-01

### Changed
- Updated blog page UI with dark theme and gradient effects
- Enhanced background animations with smooth pulse effects
- Improved responsive layout and spacing
- Optimized z-index and event handling for better performance

## [0.4.0] - 2025-08-01

### Added
- Added blog page with first blog post

## [0.3.5] - 2025-07-30

### Added
- Added Open Graph image for enhanced social sharing and SEO.

## [0.3.4] - 2025-07-30

### Added
- Added `<Helmet>` with meta tags for SEO and improved page titles on Signup page.
- Added `<Helmet>` with meta tags for SEO and enhanced page titles on Login page.
- Added `<Helmet>` with meta tags for SEO and improved page titles on Feedback page.
- Added `<Helmet>` with meta tags for SEO and improved page title on Contact page.

### Changed
- Updated meta tags for improved SEO and social sharing, including revised descriptions, authorship, and Open Graph/Twitter metadata.
- Expanded sitemap with additional URLs for improved site coverage.

## [0.3.3] - 2025-07-30

### Added
- Added LinkedIn and X social media links to the footer component.

### Changed
- Enhanced OpenSourceSection cards with hover effects, animations, and external GitHub links.
- Enhanced FeaturesSection cards with hover effects, animations, and added support for external links.

## [0.3.2] - 2025-07-29

### Changed
- **Subscription Plans**: Reduced environment variables and team members limits across all tiers

## [0.3.1] - 2025-07-28

### Added
- **API Key Management**: Enhanced ProjectSettings with comprehensive API key operations including generation, copying, and deletion
- **Role-Based Access Control**: Implemented granular permission checks for API key management based on user roles
- **Type Safety**: Added and updated TypeScript interfaces for API key related operations
- Added documentation for the new features

### Changed
- **UI/UX**: Improved API key management interface with clear visual feedback for user actions
- **Security**: Strengthened role validation for sensitive API key operations
- **Validation**: Added project name input validation with live transformation feedback

## [0.2.4] - 2025-07-22

### Fixed
- Fixed member invitation flow and added user existence check

## [0.2.3] - 2025-07-22

### Added
- Implemented secure password transfer for invited members using one-time password (OTP) flow

### Changed
- Improved UI styling and layout

## [0.2.2] - 2025-07-22

### Changed
- Improved UI styling and layout

### Fixed
- Fixed a minor UI bug

## [0.2.1] - 2025-07-22

### Changed
- Improved subscription flow
- Improved UI styling and layout

### Added
- Added confirmation dialogs for member removal and invitation cancellation

### Security
- Fixed a security vulnerability in the subscription flow

## [0.2.0] - 2025-07-22

### Added

- Added member management dialog for project owners to view and manage team members
- Added ability to remove existing project members
- Added functionality to cancel pending invitations

### Fixed

- Minor UI alignment issues
- Form validation improvements

## [0.1.0] - 2025-07-22

### Added

- Initial release of EnvHub
- Core functionality for secure environment variable management
- User authentication and authorization
- Project creation and management
- Environment variable encryption at rest
- Team collaboration features
- Documentation

[unreleased]: https://github.com/Okaymisba/EnvHub/compare/v0.2.3...HEAD
[0.4.1]: https://github.com/Okaymisba/EnvHub/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/Okaymisba/EnvHub/compare/v0.3.5...v0.4.0
[0.3.5]: https://github.com/Okaymisba/EnvHub/compare/v0.3.4...v0.3.5
[0.3.4]: https://github.com/Okaymisba/EnvHub/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/Okaymisba/EnvHub/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/Okaymisba/EnvHub/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/Okaymisba/EnvHub/compare/v0.2.4...v0.3.1
[0.2.4]: https://github.com/Okaymisba/EnvHub/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/Okaymisba/EnvHub/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/Okaymisba/EnvHub/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/Okaymisba/EnvHub/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Okaymisba/EnvHub/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Okaymisba/EnvHub/releases/tag/v0.1.0
