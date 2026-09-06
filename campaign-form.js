(function () {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz13vcXlYVMNTUhIZ__346A3ghsC4I7m3OYKj95f91Xfeq1TG1HpFXxD_e1N_4Wf3J0/exec';

  function init() {
    const form = document.getElementById('campaignForm');
    if (!form) return; // form not on this page, do nothing

    // Guard: if this script runs more than once on the same page
    // (duplicate <script> tag, widget rendered twice, etc.), only
    // ever attach ONE submit listener to this exact form element.
    if (form.dataset.campaignFormBound === 'true') return;
    form.dataset.campaignFormBound = 'true';

    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    let isSubmitting = false; // guard against double-click / double-fire

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      statusMessage.textContent = '';
      statusMessage.className = '';

      const formData = new URLSearchParams();
      formData.append('requestorName', document.getElementById('requestorName').value);
      formData.append('emailMember', document.getElementById('emailMember').value);
      formData.append('officeEmail', document.getElementById('officeEmail').value);
      formData.append('mobileNumber', document.getElementById('mobileNumber').value);
      formData.append('brandVertical', document.getElementById('brandVertical').value);
      formData.append('campaignType', document.getElementById('campaignType').value);
      formData.append('startDate', document.getElementById('startDate').value);
      // formData.append('time', document.getElementById('time').value);
      formData.append('description', document.getElementById('description').value);
      formData.append('keyVisualLink', document.getElementById('keyVisualLink').value);
      formData.append('cta', document.getElementById('cta').value);
      formData.append('skuLink', document.getElementById('skuLink').value);
      formData.append('note', document.getElementById('note').value);

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        });
        statusMessage.textContent = 'Campaign successfully submitted!';
        statusMessage.className = 'success';
        form.reset();
      } catch (error) {
        statusMessage.textContent = 'Failed to submit. Please try again.';
        statusMessage.className = 'error';
      } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Booking';
      }
    });
  }

  // Run now if DOM is already ready, otherwise wait for it.
  // This matters because the embed widget may inject this script
  // before or after the form markup depending on the CMS.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
