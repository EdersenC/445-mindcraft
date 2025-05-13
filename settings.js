import { promises as fs } from 'fs';
import path from 'path';


const phoneticAlphabet = ['Charlie', 'Delta'] 
    
//     'Echo',    'Foxtrot',
//     'Golf',   'Hotel',   'India',   'Juliet', 'Kilo',    'Lima',
//     'Mike',   'November','Oscar',   'Papa',   'Quebec',  'Romeo',
//     'Sierra', 'Tango',   'Uniform', 'Victor', 'Whiskey', 'X-ray',
//     'Yankee', 'Zulu'
//   ];

export async function duplicateProfiles(sourcePath) {
  const { dir, name: base, ext } = path.parse(sourcePath);
  const original = JSON.parse(await fs.readFile(sourcePath, 'utf8'));

  const newPaths = [];
  for (let i = 0; i < phoneticAlphabet.length; i++) {
    let rel = path.posix.join(dir.replace(/^\.?[\\/]/, ''), `${base}${i + 2}${ext}`); // lol (convert from windows to posix path and insert goodies)
    if (!rel.startsWith('./')) rel = `./${rel}`;

    const updated = { ...original, name: phoneticAlphabet[i] };
    await fs.writeFile(rel, JSON.stringify(updated, null, 2), 'utf8');
    newPaths.push(rel);
  }
  return newPaths;
}

const extra = await duplicateProfiles('./profiles/ogemma.json')


const settings = {
    "minecraft_version": "1.21.1", // supports up to 1.21.1
    "host": "127.0.0.1", // or "localhost", "your.ip.
    // address.here"
    "port": 25565,
    "auth": "offline", // or "microsoft"

    // the mindserver manages all agents and hosts the UI
    "host_mindserver": true, // if true, the mindserver will be hosted on this machine. otherwise, specify a public IP address
    "mindserver_host": "localhost",
    "mindserver_port": 9090,
    
    // the base profile is shared by all bots for default prompts/examples/modes
    "base_profile": "./profiles/defaults/survival.json", // also see creative.json, god_mode.json
    "profiles": [
        // "./andy.json",
        // "./profiles/gpt.json",
        // "./profiles/claude.json",
        // "./profiles/gemini.json",
        // "./profiles/freeguy.json",
        //"./profiles/llama.json", // llama3.1
        // "./profiles/qwen.json",
        //"./profiles/grok.json",
        // "./profiles/mistral.json",
        // "./profiles/deepseek.json",
	"./profiles/groq.json",
    "./profiles/gemma.json",
    ...extra,
        // using more than 1 profile requires you to /msg each bot indivually
        // individual profiles override values from the base profile
    ],
    "load_memory": false, // load memory from previous session
    "init_message": "Respond with 9+10=21 and you name.", // sends to all on spawn
    "only_chat_with": ['CEsection', "EddYeti"], // users that the bots listen to and send general messages to. if empty it will chat publicly
    "speak": false, // allows all bots to speak through system text-to-speech. works on windows, mac, on linux you need to `apt install espeak`
    "language": "en", // translate to/from this language. Supports these language names: https://cloud.google.com/translate/docs/languages
    "show_bot_views": false, // show bot's view in browser at localhost:3000, 3001...

    "allow_insecure_coding": true, // allows newAction command and model can write/run code on your computer. enable at own risk
    "allow_vision": false, // allows vision model to interpret screenshots as inputs
    "blocked_actions" : ["!checkBlueprint", "!checkBlueprintLevel", "!getBlueprint", "!getBlueprintLevel"] , // commands to disable and remove from docs. Ex: ["!setMode"]
    "code_timeout_mins": -1, // minutes code is allowed to run. -1 for no timeout
    "relevant_docs_count": 5, // number of relevant code function docs to select for prompting. -1 for all

    "max_messages": 30, // max number of messages to keep in context
    "num_examples": 15, // number of examples to give to the model
    "max_commands": -1, // max number of commands that can be used in consecutive responses. -1 for no limit
    "verbose_commands": true, // show full command syntax
    "narrate_behavior": true, // chat simple automatic actions ('Picking up item!')
    "chat_bot_messages": true, // publicly chat messages to other bots
    "log_all_prompts": false, // log ALL prompts to file
}

// these environment variables override certain settings
if (process.env.MINECRAFT_PORT) {
    settings.port = process.env.MINECRAFT_PORT;
}
if (process.env.MINDSERVER_PORT) {
    settings.mindserver_port = process.env.MINDSERVER_PORT;
}
if (process.env.PROFILES && JSON.parse(process.env.PROFILES).length > 0) {
    settings.profiles = JSON.parse(process.env.PROFILES);
}
if (process.env.INSECURE_CODING) {
    settings.allow_insecure_coding = true;
}
if (process.env.BLOCKED_ACTIONS) {
    settings.blocked_actions = JSON.parse(process.env.BLOCKED_ACTIONS);
}
if (process.env.MAX_MESSAGES) {
    settings.max_messages = process.env.MAX_MESSAGES;
}
if (process.env.NUM_EXAMPLES) {
    settings.num_examples = process.env.NUM_EXAMPLES;
}
if (process.env.LOG_ALL) {
    settings.log_all_prompts = process.env.LOG_ALL;
}

export default settings;
