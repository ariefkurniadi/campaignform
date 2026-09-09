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

      // Helper function to safely read element values without throwing errors if an ID is missing
      const getValue = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
      };

      const formData = new URLSearchParams();
      formData.append('requestorName', getValue('requestorName'));
      formData.append('emailMember', getValue('emailMember'));
      formData.append('officeEmail', getValue('officeEmail'));
      formData.append('mobileNumber', getValue('mobileNumber'));
      formData.append('brandVertical', getValue('brandVertical'));
      formData.append('campaignType', getValue('campaignType'));
      formData.append('startDate', getValue('startDate'));
      formData.append('endDate', getValue('endDate')); // <-- NEW: Added Campaign End Date
      formData.append('time', getValue('time'));
      formData.append('description', getValue('description'));
      formData.append('keyVisualLink', getValue('keyVisualLink'));
      formData.append('cta', getValue('cta'));
      formData.append('skuLink', getValue('skuLink'));
      formData.append('note', getValue('note'));

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });

        statusMessage.textContent = 'SYSTEM CONFIRMED: BOOKING TRANSMITTED!';
        statusMessage.className = 'success';
        form.reset();
      } catch (error) {
        statusMessage.textContent = 'TRANSMISSION ERROR: PLEASE TRY AGAIN.';
        statusMessage.className = 'error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'RESERVE SLOT NOW';
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
