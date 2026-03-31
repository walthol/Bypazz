useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(`Key pressed: ${e.key}, Ctrl pressed: ${e.ctrlKey}`); // <-- Added for debugging
      
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setStep('prompt');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
