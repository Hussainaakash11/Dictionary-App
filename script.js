const input = document.querySelector('input');
const btn = document.querySelector('button');
const dictionary = document.querySelector('.dictionary-app');


async function dictionaryFn(word) {
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await res.json();
        return data[0]; 
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}


btn.addEventListener('click', fetchandCreateCard);

// Fetch data and create card
async function fetchandCreateCard() {
    const data = await dictionaryFn(input.value.trim());

    if (!data) {
        dictionary.innerHTML = `<p style="color:white;">Word not found. Try another word!</p>`;
        return;
    }

    console.log(data);

    let partOfSpeechArray = data.meanings.map(meaning => meaning.partOfSpeech);

    // Check if phonetics/audio exists
    let audioSource = data.phonetics[0]?.audio || "";
    let phoneticText = data.phonetic || "N/A";

    // Check if example exists
    let exampleText = data.meanings[1]?.definitions[0]?.example || "No example available.";

    dictionary.innerHTML = `
     <div class="card">
        <div class="property">
            <span>Word:</span>
            <span>${data.word}</span>
        </div>   

        <div class="property">
            <span>Phonetics:</span>
            <span>${phoneticText}</span>
        </div>   

        <div class="property">
            <span>Audio:</span>
            ${audioSource ? `<audio controls src="${audioSource}"></audio>` : "No audio available"}
        </div>   

        <div class="property">
            <span>Definition:</span>
            <span>${data.meanings[0].definitions[0].definition}</span>
        </div>   

        <div class="property">
            <span>Example:</span>
            <span>${exampleText}</span>
        </div>   

        <div class="property">
            <span>Parts of Speech:</span>
            <span>${partOfSpeechArray.join(', ')}</span>
        </div> 
     </div>`;
}

// Default word when page loads
dictionaryFn("chair").then(data => {
    if (data) fetchandCreateCard();
});
