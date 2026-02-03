// State
let allData = [];
let isDataLoaded = false;

// Mock Data / Preview Data (First 20 items from your CSV for immediate visual)
const previewData = [
    { circle: "Telangana Circle", region: "Hyderabad Region", division: "Adilabad Division", office: "Kothimir B.O", pincode: "Published", type: "BO", delivery: "Delivery", district: "KUMURAM BHEEM ASIFABAD", state: "TELANGANA" },
    { circle: "Telangana Circle", region: "Hyderabad Region", division: "Adilabad Division", office: "Papanpet B.O", pincode: "Published", type: "BO", delivery: "Delivery", district: "KUMURAM BHEEM ASIFABAD", state: "TELANGANA" },
    { circle: "Telangana Circle", region: "Hyderabad Region", division: "Adilabad Division", office: "Vempalli B.O", pincode: "Published", type: "BO", delivery: "Delivery", district: "MANCHERIAL", state: "TELANGANA" },
    { circle: "Telangana Circle", region: "Hyderabad Region", division: "Hanamkonda Division", office: "Yellapur B.O", pincode: "Published", type: "BO", delivery: "Delivery", district: "HANUMAKONDA", state: "TELANGANA" },
    { circle: "Telangana Circle", region: "Hyderabad Region", division: "Karimnagar Division", office: "Mucherla B.O", pincode: "506175", type: "BO", delivery: "Delivery", district: "RAJANNA SIRCILLA", state: "TELANGANA" },
    { circle: "Telangana Circle", region: "Hyderabad Region", division: "Hanamkonda Division", office: "Kondaparthy B.O", pincode: "506004", type: "BO", delivery: "Delivery", district: "HANUMAKONDA", state: "TELANGANA" },
    { circle: "Telangana Circle", region: "Hyderabad City Region", division: "Medak Division", office: "Narlapur BO", pincode: "502102", type: "BO", delivery: "Delivery", district: "MEDAK", state: "TELANGANA" },
    { circle: "Andhra Pradesh Circle", region: "Vijayawada Region", division: "Eluru Division", office: "Ganapavaram", pincode: "534455", type: "BO", delivery: "Delivery", district: "Eluru", state: "ANDHRA PRADESH" },
    { circle: "Andhra Pradesh Circle", region: "Visakhapatnam Region", division: "Anakapalle Division", office: "Kinthalli B.O", pincode: "531027", type: "BO", delivery: "Delivery", district: "Anakapalle", state: "ANDHRA PRADESH" },
    { circle: "Telangana Circle", region: "Hyderabad Region", division: "Nalgonda Division", office: "Golankonda B.O", pincode: "508101", type: "BO", delivery: "Delivery", district: "YADADRI BHUVANAGIRI", state: "TELANGANA" }
];

// Elements
const fileInput = document.getElementById('csvFileInput');
const resultsGrid = document.getElementById('resultsGrid');
const searchInput = document.getElementById('searchInput');
const uploadCta = document.getElementById('uploadCta');
const resultCountLabel = document.getElementById('resultCount');

// Initialize with Preview Data
window.addEventListener('DOMContentLoaded', () => {
    renderGrid(previewData);
});

// File Upload Handler
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    uploadCta.innerHTML = '<div style="color:var(--primary); font-weight:600">Processing Database... Please wait.</div>';

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            allData = results.data;
            isDataLoaded = true;
            uploadCta.style.display = 'none'; // Hide CTA on success
            resultCountLabel.innerText = `Database Loaded: ${allData.length.toLocaleString()} locations available`;
            renderGrid(allData.slice(0, 50)); // Show more initial data
            alert("Database Loaded Successfully! You can now search all of India.");
        },
        error: function(err) {
            console.error(err);
            uploadCta.innerHTML = '<div style="color:red">Error loading file. Please try again.</div>';
        }
    });
});

// Search Handler
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    // Use loaded data or preview data
    const sourceData = isDataLoaded ? allData : previewData;

    // Filter
    // Note: CSV keys based on file check: officename, pincode, district, statename
    const results = sourceData.filter(item => {
        // Fallback for key names since CSVs can vary slightly or PapaParse might normalize
        // Based on the file view: circlename, regionname, divisionname, officename, pincode, officetype, delivery, district, statename
        const name = (item.officename || item.office || "").toLowerCase();
        const pin = (item.pincode || "").toLowerCase();
        const dist = (item.district || "").toLowerCase();
        const state = (item.statename || item.state || "").toLowerCase();

        return name.includes(query) || pin.includes(query) || dist.includes(query) || state.includes(query);
    });

    // Update UI
    resultCountLabel.innerText = `Found ${results.length} results for "${query}"`;
    renderGrid(results.slice(0, 100)); // Limit render for performance
    
    if (!isDataLoaded && results.length === 0) {
        alert("No results in preview data. Please load the full CSV file via the button below search.");
    }
}

// Enter key for search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Render Function
function renderGrid(data) {
    resultsGrid.innerHTML = '';

    if (data.length === 0) {
        resultsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-light)">
                <h3>No locations found</h3>
                <p>Try a different keyword or load the full database.</p>
            </div>
        `;
        return;
    }

    data.forEach(item => {
        // Fallback checks
        const name = item.officename || item.office || "Unknown Office";
        const pin = item.pincode || "N/A";
        const district = item.district || "Unknown District";
        const state = item.statename || item.state || "India";
        const division = item.divisionname || item.division || "";

        const card = document.createElement('div');
        card.className = 'pin-card';
        card.innerHTML = `
            <div class="pin-location">
                <i data-lucide="map-pin" style="width:16px"></i> ${state}
            </div>
            <div class="pin-code">${pin}</div>
            <h4 style="font-size:1.2rem; margin-bottom:4px;">${name}</h4>
            <div class="pin-details">
                ${division} • ${district}
            </div>
            
            <div class="card-actions">
                <button class="btn" style="padding:8px 16px; font-size:0.85rem; background:#f1f5f9; color:#475569">
                    Details
                </button>
                 <button class="btn" style="padding:8px 16px; font-size:0.85rem; background:#ecfdf5; color:#059669">
                    <i data-lucide="navigation" style="width:14px; margin-right:4px"></i> Map
                </button>
            </div>
        `;
        resultsGrid.appendChild(card);
    });

    // Re-initialize icons for new elements
    if (window.lucide) {
        lucide.createIcons();
    }
}
