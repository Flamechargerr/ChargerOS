# ChargerOS Specifications

## Project Identity

- **Name:** ChargerOS
- **Creator:** Flamechargerr
- **Project type:** Ubuntu-inspired browser desktop OS simulation
- **Base chosen:** v2 archive, because it has the stronger shell and 59 registered apps
- **Positioning:** Web-based Linux desktop environment, not a bootable Ubuntu ISO

## Core Specs

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/Radix-style primitives
- **Icons:** Lucide React
- **Persistence:** Browser localStorage
- **Runtime:** Client-side browser app
- **Dev server:** `http://127.0.0.1:3000/`
- **Build command:** `npm run build`

## App Suite

ChargerOS currently registers **59 apps** across 8 categories:

- **System:** Files, Terminal, Settings, Calculator, Text Editor, Calendar, Clock, System Monitor, Disk Usage, Backup
- **Internet:** Browser, Email, Chat, Weather, RSS Reader, FTP Client, Remote Desktop
- **Office:** Writer, Spreadsheet, Presentation, Notes, Todo List, PDF Viewer, Dictionary
- **Graphics:** Image Viewer, Paint, Screenshot, Color Picker, Icon Viewer, Font Viewer, ASCII Art, QR Code
- **Media:** Music Player, Video Player, Camera, Sound Recorder, CD Burner, Media Converter
- **Development:** Code Editor, Git Client, Database, API Tester, Regex Tester
- **Games:** Chess, Solitaire, Minesweeper, Snake, Tetris, Tic Tac Toe, 2048
- **Utilities:** Password Generator, Unit Converter, Scientific Calc, Network Tools, Task Manager, File Search, Archive Manager, System Info, Help

## Desktop Shell

- Login screen with username/password and guest entry
- Wallpaper-based desktop
- Top panel with clock, indicators, settings/power menu, and open-window count
- Bottom taskbar with app launcher, pinned apps, running indicators, show desktop, and trash
- Desktop icons with click and double-click launching
- Desktop context menu for common actions

## Window Manager

- Draggable windows
- Resizable windows
- Minimize, maximize, restore, close
- Z-index focus management
- Running app indicators
- Centered window launch with cascade offsets

## Virtual Filesystem

- Simulated Unix-like tree: `/home`, `/etc`, `/tmp`, `/var`, `/usr`
- Browser-persisted file data
- File read/write/delete/create folder operations
- Rename and move operations
- Sample `/etc/os-release` identifying ChargerOS

## Terminal Commands

Implemented command set:

```text
ls, cd, pwd, mkdir, touch, cat, rm, echo, clear,
whoami, date, uname, neofetch, tree, history, help
```

## Verification Notes

`npm run build` passes successfully. Current build warnings:

- Spreadsheet and Scientific Calc use `eval` for formula evaluation.
- The JavaScript bundle is large because app modules are bundled together.
- Browserslist data warning can be resolved with `npx update-browserslist-db@latest`.
- `npm install` reports dependency audit issues; run `npm audit` before public deployment.

## Recommended Next Improvements

- Add lazy-loaded app modules.
- Replace formula `eval` with a safe expression parser.
- Add Playwright or Vitest coverage for shell workflows.
- Split guest/user storage.
- Add deployment URL, demo video, and release tags.
