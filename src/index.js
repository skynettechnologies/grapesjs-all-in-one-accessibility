import en from './locale/en';

export default (editor, opts = {}) => {
  const options = {
    ...{
      i18n: {},
      // default options
    }, ...opts
  };

  // Load i18n files
  editor.I18n && editor.I18n.addMessages({
    en,
    ...options.i18n,
  });

  const panelManager = editor.Panels;

  // Add custom button in the right sidebar ("options" panel)
  panelManager.addButton('options', {
    id: 'aioa-trial-button',
    className: 'fa fa-universal-access', // FontAwesome icon
    attributes: { title: 'All in One Accessibility' },
    command: 'open-aioa-trial',
  });

  // Define the command for the button
  editor.Commands.add('open-aioa-trial', {
    run() {
      // 👇 Redirect user to the trial URL
      window.open('https://ada.skynettechnologies.us/trial-subscription', '_blank');
    },
  });

  // const injectWidgetScript = (frame) => {
  //   try {
  //     const iframeDoc = frame?.contentDocument || frame?.contentWindow?.document;
  //     if (!iframeDoc) return;

  //     const head = iframeDoc.head;
  //     if (!head) return;

  //     // Avoid duplicate injection
  //     if (head.querySelector('#aioa-adawidget')) return;

  //     const script = iframeDoc.createElement('script');
  //     script.id = 'aioa-adawidget';
  //     script.src =
  //       'https://www.skynettechnologies.com/accessibility/js/all-in-one-accessibility-js-widget-minify.js?colorcode=#420083&token=&position=bottom_right';
  //     script.defer = true;

  //     head.appendChild(script);
  //     console.log('✅ AIOA Widget Script Injected');
  //   } catch (err) {
  //     console.error('⚠️ Failed to inject script:', err);
  //   }
  // };

  const injectWidgetScript = async (frame) => {
    try {
      const iframeDoc =
        frame?.contentDocument || frame?.contentWindow?.document;
      if (!iframeDoc) return;

      const head = iframeDoc.head;
      if (!head) return;

      // Avoid duplicate injection
      if (head.querySelector('#aioa-adawidget')) return;

      let scriptSrc =
        'https://www.skynettechnologies.com/accessibility/js/all-in-one-accessibility-js-widget-minify.js?colorcode=#420083&token=&position=bottom_right';

      const isEU = await getIsEU();
      if (isEU) {
        scriptSrc = 'https://eu.skynettechnologies.com/accessibility/js/all-in-one-accessibility-js-widget-minify.js?colorcode=#420083&token=&position=bottom_right';
      }

      const script = iframeDoc.createElement('script');
      script.id = 'aioa-adawidget';
      script.src = scriptSrc;
      script.defer = true;

      head.appendChild(script);
      console.log('✅ AIOA Widget Script Injected', scriptSrc);
    } catch (err) {
      console.error('⚠️ Failed to inject script:', err);
    }
  };


  const getIsEU = async () => {
    const cached = localStorage.getItem('aioa_in_eu');
    if (cached !== null) return cached === 'true';

    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    const isEU = data?.in_eu === true;

    localStorage.setItem('aioa_in_eu', String(isEU));
    return isEU;
  };

  // Run after editor fully loads
  editor.on('load', () => {
    const frame = editor.Canvas.getFrameEl();
    if (frame) {
      injectWidgetScript(frame);
    } else {
    }
  });
};