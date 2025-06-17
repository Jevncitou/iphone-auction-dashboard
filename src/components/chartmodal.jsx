const handleGradeChange = async (e) => {
  const selectedUrl = e.target.value;
  if (!selectedUrl) return;

  try {
    const res = await fetch(selectedUrl, { method: 'HEAD' });
    if (res.ok) {
      window.location.href = selectedUrl;
    } else {
      // fallback to the empty chart template
      const fallbackUrl = selectedUrl.replace(/(Grade_[A-Z]+)\/.+\.html/, '$1/empty.html');
      const fallbackRes = await fetch(fallbackUrl, { method: 'HEAD' });
      if (fallbackRes.ok) {
        window.location.href = fallbackUrl;
      } else {
        alert('No data available for this grade.');
      }
    }
  } catch (err) {
    alert('Failed to load grade view.');
  }
};
