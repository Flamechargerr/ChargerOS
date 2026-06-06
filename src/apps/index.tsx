// Register all app components
import { registerAppComponent } from '@/components/Window';

// System
import FileManager from './FileManager';
import Terminal from './Terminal';
import Settings from './Settings';
import Calculator from './Calculator';
import TextEditor from './TextEditor';
import CalendarApp from './CalendarApp';
import Clock from './Clock';
import SystemMonitor from './SystemMonitor';
import DiskUsage from './DiskUsage';
import Backup from './Backup';

// Internet
import Browser from './Browser';
import Email from './Email';
import Chat from './Chat';
import Weather from './Weather';
import RSSReader from './RSSReader';
import FTPClient from './FTPClient';
import RemoteDesktop from './RemoteDesktop';

// Office
import Writer from './Writer';
import Spreadsheet from './Spreadsheet';
import Impress from './Impress';
import Notes from './Notes';
import Todo from './Todo';
import PDFViewer from './PDFViewer';
import Dictionary from './Dictionary';

// Graphics
import ImageViewer from './ImageViewer';
import Paint from './Paint';
import Screenshot from './Screenshot';
import ColorPicker from './ColorPicker';
import IconViewer from './IconViewer';
import FontViewer from './FontViewer';
import AsciiArt from './AsciiArt';
import QRCode from './QRCode';

// Media
import MusicPlayer from './MusicPlayer';
import VideoPlayer from './VideoPlayer';
import Camera from './Camera';
import SoundRecorder from './SoundRecorder';
import CDBurner from './CDBurner';
import MediaConverter from './MediaConverter';

// Development
import CodeEditor from './CodeEditor';
import GitClient from './GitClient';
import DatabaseManager from './DatabaseManager';
import APITester from './APITester';
import RegexTester from './RegexTester';

// Games
import Chess from './Chess';
import Solitaire from './Solitaire';
import Minesweeper from './Minesweeper';
import Snake from './Snake';
import Tetris from './Tetris';
import TicTacToe from './TicTacToe';
import Game2048 from './Game2048';

// Utilities
import PasswordGenerator from './PasswordGenerator';
import UnitConverter from './UnitConverter';
import SciCalc from './SciCalc';
import NetworkTools from './NetworkTools';
import TaskManager from './TaskManager';
import FileSearch from './FileSearch';
import ArchiveManager from './ArchiveManager';
import SystemInfo from './SystemInfo';
import Help from './Help';

export function registerAllApps() {
  // System
  registerAppComponent('filemanager', FileManager);
  registerAppComponent('terminal', Terminal);
  registerAppComponent('settings', Settings);
  registerAppComponent('calculator', Calculator);
  registerAppComponent('texteditor', TextEditor);
  registerAppComponent('calendar', CalendarApp);
  registerAppComponent('clock', Clock);
  registerAppComponent('systemmonitor', SystemMonitor);
  registerAppComponent('diskusage', DiskUsage);
  registerAppComponent('backup', Backup);

  // Internet
  registerAppComponent('browser', Browser);
  registerAppComponent('email', Email);
  registerAppComponent('chat', Chat);
  registerAppComponent('weather', Weather);
  registerAppComponent('rss', RSSReader);
  registerAppComponent('ftp', FTPClient);
  registerAppComponent('remote', RemoteDesktop);

  // Office
  registerAppComponent('writer', Writer);
  registerAppComponent('calc', Spreadsheet);
  registerAppComponent('impress', Impress);
  registerAppComponent('notes', Notes);
  registerAppComponent('todo', Todo);
  registerAppComponent('pdfviewer', PDFViewer);
  registerAppComponent('dictionary', Dictionary);

  // Graphics
  registerAppComponent('imageviewer', ImageViewer);
  registerAppComponent('paint', Paint);
  registerAppComponent('screenshot', Screenshot);
  registerAppComponent('colorpicker', ColorPicker);
  registerAppComponent('iconviewer', IconViewer);
  registerAppComponent('fontviewer', FontViewer);
  registerAppComponent('asciiart', AsciiArt);
  registerAppComponent('qrcode', QRCode);

  // Media
  registerAppComponent('music', MusicPlayer);
  registerAppComponent('video', VideoPlayer);
  registerAppComponent('camera', Camera);
  registerAppComponent('recorder', SoundRecorder);
  registerAppComponent('cdburner', CDBurner);
  registerAppComponent('mediaconverter', MediaConverter);

  // Development
  registerAppComponent('codeeditor', CodeEditor);
  registerAppComponent('git', GitClient);
  registerAppComponent('database', DatabaseManager);
  registerAppComponent('apitester', APITester);
  registerAppComponent('regex', RegexTester);

  // Games
  registerAppComponent('chess', Chess);
  registerAppComponent('solitaire', Solitaire);
  registerAppComponent('minesweeper', Minesweeper);
  registerAppComponent('snake', Snake);
  registerAppComponent('tetris', Tetris);
  registerAppComponent('tictactoe', TicTacToe);
  registerAppComponent('game2048', Game2048);

  // Utilities
  registerAppComponent('password', PasswordGenerator);
  registerAppComponent('unitconverter', UnitConverter);
  registerAppComponent('scicalc', SciCalc);
  registerAppComponent('network', NetworkTools);
  registerAppComponent('taskmanager', TaskManager);
  registerAppComponent('search', FileSearch);
  registerAppComponent('archive', ArchiveManager);
  registerAppComponent('sysinfo', SystemInfo);
  registerAppComponent('help', Help);
}
