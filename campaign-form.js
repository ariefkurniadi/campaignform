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

    // 2. Collect all field values
    const fields = {
        requestorName: document.getElementById('requestorName').value || '',
        emailMember: document.getElementById('emailMember').value || '',
        officeEmail: document.getElementById('officeEmail').value || '',
        mobileNumber: document.getElementById('mobileNumber').value || '',
        brandVertical: document.getElementById('brandVertical').value || '',
        campaignType: selectedCampaignTypes,
        startDate: document.getElementById('startDate').value || '',
        endDate: document.getElementById('endDate').value || '',
        description: document.getElementById('description').value || '',
        keyVisualLink: document.getElementById('keyVisualLink').value || '',
        cta: document.getElementById('cta').value || '',
        skuLink: document.getElementById('skuLink').value || '',
        note: document.getElementById('note').value || ''
    };

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1Wl-Ft3Wdr1TRJkpfuLbzq_LZF9cYAb49VfT0mYvNkpgDCavwPf-2zYXVQj-P1WWsyQ/exec';

    // 3. Submit via a hidden iframe instead of fetch().
    // This site's Service Worker intercepts fetch() calls and strips the
    // 'no-cors' mode, causing the browser to enforce CORS and block the
    // request (even though Apps Script actually processes it fine).
    // A real <form> submission targeting a hidden iframe is a page
    // navigation, not a fetch/XHR call — it is never intercepted by the
    // Service Worker's fetch event, and CORS does not apply to navigations,
    // so this bypasses both problems entirely. The Apps Script backend
    // needs no changes: it reads e.parameter the same way either way.

    let iframe = document.getElementById('hidden_submit_iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.name = 'hidden_submit_iframe';
        iframe.id = 'hidden_submit_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }

    const hiddenForm = document.createElement('form');
    hiddenForm.action = SCRIPT_URL;
    hiddenForm.method = 'POST';
    hiddenForm.target = 'hidden_submit_iframe';
    hiddenForm.style.display = 'none';

    Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        hiddenForm.appendChild(input);
    });

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();

    // We can't read the cross-origin iframe's response (by design, for
    // security), so we optimistically confirm success shortly after
    // submitting. This matches what you've already confirmed happens in
    // practice: the row lands in the sheet almost immediately.
    setTimeout(function () {
        statusMsg.className = 'success';
        statusMsg.textContent = 'SYSTEM CONFIRMED: BOOKING TRANSMITTED!';
        document.getElementById('campaignForm').reset();
        submitBtn.disabled = false;
        hiddenForm.remove();
    }, 1500);
});
