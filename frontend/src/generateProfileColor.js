const generateProfileColor = (str) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var color = "#";
    for (var j = 0; j < 3; j++) {
      var value = (hash >> (j * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
};
  
export { generateProfileColor as default };
