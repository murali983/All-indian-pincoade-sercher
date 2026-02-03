// మీ CSV ఫైల్ పేరు
const csvFileName = 'all india pincoads - all india pincoad with adress.csv';

document.addEventListener('DOMContentLoaded', () => {
    fetch(csvFileName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log("డేటా విజయవంతంగా లోడ్ అయ్యింది!");
            // ఇక్కడ మీ సెర్చ్ లేదా టేబుల్ ఫంక్షనాలిటీ వస్తుంది
        })
        .catch(error => {
            console.error("ఫైల్ లోడ్ చేయడంలో లోపం:", error);
        });
});

