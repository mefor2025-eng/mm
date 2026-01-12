const API="https://script.google.com/macros/s/AKfycbyj4yPuQyJkLjy8kpXRs1cZZ3rZmxHSKwKTG6KHzLQ2QtpcJWw8q_bMW5esfYvhVAWQ/exec";

function hideBroken(img){
  img.onerror=()=>img.style.display="none";
}
