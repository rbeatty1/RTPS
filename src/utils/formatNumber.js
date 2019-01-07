/*
  FormatNumber(num)
    @desc: Returns a formatted number for display–either a percentage or comma-separated value
    @param:
      - num => number to be formatted
    @return: formatted number for display    
*/
export const FormatNumber = num => {
  return num.toString().indexOf(".") != -1 // check if there is a decimal
    ? num + "%" // decimal present => format as percentage
    : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // decimal not present => insert comma after every third digit
};