// Evidence register: in ?static renders the first source is shown open, as a demo state.
const U = window.Vikura && window.Vikura.util;
const first = document.querySelector('.s-ciencia [data-static-open]');
if (U && U.STATIC && first) first.click();
