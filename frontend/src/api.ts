const submitCodeFetch = async (code: string, compileOptions: string, executables: string[]) => {
  const url = 'https://api-broken-moon-5814.fly.dev/api/controller';

  const requestBody = {
    input: code,
    compileOptions: compileOptions,
    extraExecutables: executables,
  };

  // return sampleResponse3;
  // Perform the fetch request
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
};

export default submitCodeFetch;
