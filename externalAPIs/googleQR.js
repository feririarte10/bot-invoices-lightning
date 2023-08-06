const googleAPIURL = "https://chart.googleapis.com/chart?cht=qr";

module.exports = {
  generateQR(data, height, width) {
    if (!data) throw new Error("A url must be provided");

    return `${googleAPIURL}&chl=${data}${
      height && width ? "&chs=" + height + "x" + width : "&chs=400x400"
    }${"&chld=H|1"}`;
  },
};
