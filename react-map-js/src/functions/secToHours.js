// sec to hours function , we use it in the summary
const secToHours = (sec) => {
    const h = sec / 3600 ^ 0;
    const m = (sec - h * 3600) / 60 ^ 0;
    const s = (sec - h * 3600 - m * 60).toFixed(0);
    return (h < 10 ? "0" + h : h) + " h. " + (m < 10 ? "0" + m : m) + " min. " + (s < 10 ? "0" + s : s) + " sec."
}

export default secToHours