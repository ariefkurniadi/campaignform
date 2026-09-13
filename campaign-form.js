document.getElementById('campaignForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('statusMessage');

    submitBtn.disabled = true;
    statusMsg.className = '';
    statusMsg.textContent = 'Submitting form...';

    // 1. Collect all checked Campaign Type values into a comma-separated string
    const checkedBoxes = document.querySelectorAll('input[name="campaignType"]:checked');
    const selectedCampaignTypes = Array.from(checkedBoxes).map(cb => cb.value).join(', ');

    // Validate at least one checkbox is selected
    if (!selectedCampaignTypes) {
        statusMsg.className = 'error';
        statusMsg.textContent = 'Please select at least one Campaign Type.';
        submitBtn.disabled = false;
        return;
    }

    // 2. Build form payload using standard FormData
    const formData = new FormData();
    formData.append('requestorName', document.getElementById('requestorName').value || '');
    formData.append('emailMember', document.getElementById('emailMember').value || '');
    formData.append('officeEmail', document.getElementById('officeEmail').value || '');
    formData.append('mobileNumber', document.getElementById('mobileNumber').value || '');
    formData.append('brandVertical', document.getElementById('brandVertical').value || '');
    formData.append('campaignType', selectedCampaignTypes);
    formData.append('startDate', document.getElementById('startDate').value || '');
    formData.append('endDate', document.getElementById('endDate').value || '');
    formData.append('description', document.getElementById('description').value || '');
    formData.append('keyVisualLink', document.getElementById('keyVisualLink').value || '');
    formData.append('cta', document.getElementById('cta').value || '');
    formData.append('skuLink', document.getElementById('skuLink').value || '');
    formData.append('note', document.getElementById('note').value || '');

    // 3. Send to Google Apps Script Web App
    fetch('https://script.google.com/macros/s/AKfycbyHr5Tvmz6qwNUzO7-YejTmi3fCJ6-fquYbk5v4M6TlKmFmJQ1G0Q9rq0axvsgcvg7Dhw/exec', {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then(() => {
            // With mode:'no-cors' we can't read the actual response,
            // but if fetch resolved at all (no network error), treat it as success.
            statusMsg.className = 'success';
            statusMsg.textContent = 'SYSTEM CONFIRMED: BOOKING TRANSMITTED!';
            document.getElementById('campaignForm').reset();
        })
        .catch(error => {
            statusMsg.className = 'error';
            statusMsg.textContent = 'TRANSMISSION ERROR: PLEASE TRY AGAIN. ' + error.message;
        })
        .finally(() => {
            submitBtn.disabled = false;
        });
});
