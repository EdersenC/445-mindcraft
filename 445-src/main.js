

import path from 'path';
import fs from 'fs';

function produceModel(name,model, provider, maxTokens, embedding) {
    return {
        name: name,
        model: provider+'/'+model,
        max_tokens: maxTokens,
        embedding: embedding
    };
}


function saveModelProfile(model,dir,agents) {
    let baseName = model.name;
    for (let i = 0; i < agents; i++) {
        model.name = baseName + `-${i}`;
        const filePath = path.join(dir, model.name+'.json');
        // Define the path to the JSON file
        // Write the updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(model, null, 2));
    }

}

const model = produceModel(
    'gemma',
    'gemma3:4b',
    'ollama',
    4000,
    'ollama/mxbai-embed-large'
);
saveModelProfile(model,'../profiles/infinity',100);
