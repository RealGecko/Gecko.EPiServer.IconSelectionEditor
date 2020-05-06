# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2020-05-06

### Added

- Possibility to filter icons by name and keywords. 

### Changed

- When ```IconsPerRow``` is specified, width for table will be calculated instead of using menu separators.

### Fixed
- Id of the icon should be stored in database instead of icon name.

## [1.1.0] - 2020-04-22

### Added

- ```IconsPerRow``` property to ```SelectIconAttribute``` which can be used to specify how many icons should be displayed in a grid row.
- ```RequireClientResources``` property to ```SelectIconAttribute``` which can be used to configure additional dependencies (like css for icon fonts) for dojo widget.

## [1.0.0] - 2020-04-20

### Added

- Initial version of Icon Selection Editor for EPiServer.

[unreleased]: https://github.com/RealGecko/Gecko.EPiServer.IconSelectionEditor/compare/1.2.0...HEAD
[1.2.0]: https://github.com/RealGecko/Gecko.EPiServer.IconSelectionEditor/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/RealGecko/Gecko.EPiServer.IconSelectionEditor/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/RealGecko/Gecko.EPiServer.IconSelectionEditor/releases/tag/1.0.0
