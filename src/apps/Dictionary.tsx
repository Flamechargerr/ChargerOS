import { useState } from 'react';
import { Search, BookOpen, Volume2 } from 'lucide-react';

const DICTIONARY: Record<string, { pronunciation: string; partOfSpeech: string; definitions: string[]; synonyms: string[] }> = {
  'linux': { pronunciation: '/ˈlɪnəks/', partOfSpeech: 'noun', definitions: ['An open-source operating system kernel first released by Linus Torvalds in 1991.', 'A family of open-source Unix-like operating systems based on the Linux kernel.'], synonyms: ['OS', 'kernel', 'operating system'] },
  'browser': { pronunciation: '/ˈbraʊzər/', partOfSpeech: 'noun', definitions: ['A software application used to access and view websites on the internet.', 'A program that retrieves and displays pages from the World Wide Web.'], synonyms: ['web browser', 'navigator', 'explorer'] },
  'terminal': { pronunciation: '/ˈtɜːrmɪnl/', partOfSpeech: 'noun', definitions: ['A device or program that allows a user to enter commands and display output from a computer system.', 'An electronic or electromechanical hardware device used for entering data into and displaying data from a computer.'], synonyms: ['console', 'command line', 'shell'] },
  'desktop': { pronunciation: '/ˈdesktɒp/', partOfSpeech: 'noun', definitions: ['The primary user interface of a computer system displayed on screen.', 'A personal computer designed to be used at a desk.'], synonyms: ['workstation', 'PC', 'home screen'] },
  'file': { pronunciation: '/faɪl/', partOfSpeech: 'noun', definitions: ['A collection of data or information stored under a specific name on a computer.', 'A resource for recording data in a storage device.'], synonyms: ['document', 'record', 'data'] },
  'code': { pronunciation: '/koʊd/', partOfSpeech: 'noun', definitions: ['Instructions written in a programming language that a computer can execute.', 'A system of words, letters, or symbols used to represent others for secrecy or brevity.'], synonyms: ['program', 'script', 'source'] },
  'network': { pronunciation: '/ˈnetwɜːrk/', partOfSpeech: 'noun', definitions: ['A group of interconnected computers that can communicate and share resources.', 'A system of lines, wires, or channels that cross or interconnect.'], synonyms: ['web', 'system', 'grid'] },
  'server': { pronunciation: '/ˈsɜːrvər/', partOfSpeech: 'noun', definitions: ['A computer or program that manages network resources and provides services to other computers.', 'A person or thing that serves.'], synonyms: ['host', 'mainframe', 'server machine'] },
  'application': { pronunciation: '/ˌæplɪˈkeɪʃn/', partOfSpeech: 'noun', definitions: ['A software program designed to perform a specific task or set of tasks.', 'A formal request to an authority.'], synonyms: ['app', 'program', 'software'] },
  'data': { pronunciation: '/ˈdeɪtə/', partOfSpeech: 'noun', definitions: ['Facts and statistics collected together for reference or analysis.', 'Information in digital form that can be transmitted or processed.'], synonyms: ['information', 'facts', 'statistics'] },
  'program': { pronunciation: '/ˈproʊɡræm/', partOfSpeech: 'noun', definitions: ['A set of instructions that a computer follows to perform a task.', 'A planned series of future events or performances.'], synonyms: ['software', 'application', 'routine'] },
  'system': { pronunciation: '/ˈsɪstəm/', partOfSpeech: 'noun', definitions: ['A set of connected things or parts forming a complex whole.', 'A set of principles or procedures according to which something is done.'], synonyms: ['structure', 'framework', 'network'] },
  'user': { pronunciation: '/ˈjuːzər/', partOfSpeech: 'noun', definitions: ['A person who uses or operates something, especially a computer or software.', 'A person who takes illegal drugs.'], synonyms: ['operator', 'consumer', 'end user'] },
  'open': { pronunciation: '/ˈoʊpən/', partOfSpeech: 'adjective', definitions: ['Allowing access, passage, or a view through an empty space.', 'Exposed to view or not covered.'], synonyms: ['unlocked', 'accessible', 'available'] },
  'source': { pronunciation: '/sɔːrs/', partOfSpeech: 'noun', definitions: ['A place, person, or thing from which something originates.', 'Code written in a programming language before compilation.'], synonyms: ['origin', 'root', 'beginning'] },
};

export default function Dictionary() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ word: string; data: typeof DICTIONARY['linux'] } | null>(null);
  const [notFound, setNotFound] = useState(false);

  const search = () => {
    const key = query.toLowerCase().trim();
    if (DICTIONARY[key]) {
      setResult({ word: key, data: DICTIONARY[key] });
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const suggestions = Object.keys(DICTIONARY).filter(w => w.includes(query.toLowerCase()) && query.length > 0);

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="p-4">
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3">
          <Search size={14} className="text-white/30" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="Search for a word..."
            className="flex-1 bg-transparent text-white text-sm py-2.5 outline-none placeholder-white/30"
          />
          <button onClick={search} className="px-3 py-1 bg-[#4a9eff] text-white text-xs rounded hover:bg-[#3d8de6]">Search</button>
        </div>
        {query && suggestions.length > 0 && (
          <div className="mt-1 bg-[#252526] rounded-lg border border-[#333] overflow-hidden">
            {suggestions.slice(0, 5).map(s => (
              <button key={s} onClick={() => { setQuery(s); search(); }} className="w-full text-left px-3 py-1.5 text-sm text-white/60 hover:bg-white/10 hover:text-white">{s}</button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto px-4 pb-4">
        {result && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-white text-2xl font-medium capitalize">{result.word}</h2>
              <button className="text-white/40 hover:text-[#4a9eff]"><Volume2 size={16} /></button>
            </div>
            <p className="text-[#4a9eff] text-sm mb-1">{result.data.pronunciation}</p>
            <p className="text-white/40 text-sm italic mb-4">{result.data.partOfSpeech}</p>
            <div className="mb-4">
              <h3 className="text-white/60 text-xs uppercase mb-2">Definitions</h3>
              {result.data.definitions.map((def, i) => (
                <p key={i} className="text-white/80 text-sm mb-2">{i + 1}. {def}</p>
              ))}
            </div>
            <div>
              <h3 className="text-white/60 text-xs uppercase mb-2">Synonyms</h3>
              <div className="flex flex-wrap gap-2">
                {result.data.synonyms.map((syn, i) => (
                  <span key={i} className="px-2 py-1 bg-white/10 rounded text-white/60 text-xs">{syn}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        {notFound && (
          <div className="text-center text-white/30 text-sm mt-8">
            <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
            <p>No definition found for &quot;{query}&quot;</p>
            <p className="text-white/20 text-xs mt-1">Try: linux, browser, terminal, desktop, code, network, server, application, data, program, system, user, open, source</p>
          </div>
        )}
      </div>
    </div>
  );
}
