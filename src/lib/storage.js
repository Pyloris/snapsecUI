const getData = (key) => {
  try {
    const data = localStorage.getItem(key);

    if (data) {
      let parsed = data;
      try {
        parsed = JSON.parse(data);
      } catch (error) {
        return parsed;
      }
      return parsed;
    }
  } catch (error) {
    console.error('Read from local storage', error);
  }
};

const setData = (key, value) => {
  try {
    let parsedValue = value;
    try {
      parsedValue = JSON.stringify(value);
    } catch (error) {
      parsedValue = value;
    }
    localStorage.setItem(key, parsedValue);
  } catch (error) {
    console.error('Save in local storage', error);
  }
};

export { getData, setData };
