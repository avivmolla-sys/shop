document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".item_form form");
    const categoryInput = document.getElementById("item_Type");
    const descriptionInput = document.getElementById("item_description");
    const colorInput = document.getElementById("item_color");
    const priceInput = document.getElementById("item_price");
    const discountInput = document.getElementById("item_Discunt");
    const picInput = document.getElementById("item_Pic");
    const table = document.querySelector(".item_table table");
    const tableContainer = document.querySelector(".item_table");

    let summaryDiv = document.createElement("div");
    summaryDiv.id = "summary_data";
    tableContainer.appendChild(summaryDiv);

    let items = JSON.parse(localStorage.getItem("clothingItems")) || [];

    renderTable();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const category = categoryInput.value;
        const description = descriptionInput.value.trim();
        const color = colorInput.value;
        const priceText = priceInput.value;
        const discountText = discountInput.value;
        const picUrl = picInput.value.trim();

    
        if (!category || !description || !color || !priceText || !discountText || !picUrl) {
            window.alert("שגיאה: נא למלא את כל השדות בטופס.");
            return; 
                }

        const price = parseFloat(priceText);
        const discount = parseFloat(discountText);

        if (price <= 0 || price > 1000) {
            window.alert("שגיאה: המחיר חייב להיות מספר חיובי ועד 1,000 שקלים.");
           
            priceInput.focus(); 
            return;
        }

        
        if (discount < 0 || discount > 100) {
            window.alert("שגיאה: אחוז ההנחה חייב להיות מספר בין 0 ל-100 %.");
            discountInput.focus();
            return;
        }

    
        try {
            new URL(picUrl);
        } catch (_) {
            window.alert("שגיאה: הקישור לתמונה שהזנת אינו חוקי. אנא ודא שהוא מתחיל ב-http:// או https://");
            picInput.focus();
            return;
        }

        const item = {
            id: Date.now(),
            category: category,
            description: description,
            color: color,
            price: price,
            discount: discount,
            pic: picUrl
        };

        
        items.push(item);
        localStorage.setItem("clothingItems", JSON.stringify(items));
        
        renderTable();
        form.reset();
        categoryInput.focus();
    });

    function renderTable() {
        table.innerHTML = `
            <tr>
                <th>סוג בגד</th>
                <th>תיאור הבגד</th>
                <th>צבע הבגד</th>
                <th>מחיר סופי</th>
                <th>הנחה (%)</th>
                <th>תמונת הבגד</th>
                <th>מחיקה</th>
            </tr>
        `;

        const categoryNames = {
            "shirt": "חולצה",
            "pants": "מכנס",
            "dress": "שמלה",
            "skirt": "חצאית",
            "hat": "כובע",
            "other": "אחר"
        };

        let totalFinalPrice = 0;

        items.forEach(item => {
            const row = document.createElement("tr");
            const finalPrice = item.price - (item.price * (item.discount / 100));
            totalFinalPrice += finalPrice;

            let priceColorClass = "";
            if (finalPrice >= 0 && finalPrice <= 200) {
                priceColorClass = "color: green;";
            } else if (finalPrice > 200 && finalPrice <= 700) {
                priceColorClass = "color: blue;";
            } else if (finalPrice > 700 && finalPrice <= 1000) {
                priceColorClass = "color: red;";
            }

            const colorDisplay = `<span style="color: ${item.color}; font-weight: bold; background-color: #f4f7f6; padding: 2px 5px; border: 1px solid #ccc;">${item.color}</span>`;
            const imageDisplay = `<img src="${item.pic}" alt="תמונת פריט" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px;">`;

            row.innerHTML = `
                <td>${categoryNames[item.category] || item.category}</td>
                <td>${item.description}</td>
                <td>${colorDisplay}</td>
                <td style="${priceColorClass} font-weight: bold;">₪${finalPrice.toFixed(2)}</td>
                <td>${item.discount}%</td>
                <td>${imageDisplay}</td>
                <td>
                    <button class="delete-btn" data-id="${item.id}">מחק</button>
                </td>
            `;
            table.appendChild(row);
        });

        const avgPrice = items.length > 0 ? (totalFinalPrice / items.length) : 0;
        summaryDiv.innerHTML = `סה"כ פריטים: <span>${items.length}</span> | ממוצע מחירים: <span>₪${avgPrice.toFixed(2)}</span>`;
    }

    table.addEventListener("click", (e) => {
        const btn = e.target;
        if (btn.classList.contains("delete-btn")) {
            const id = Number(btn.getAttribute("data-id"));
            items = items.filter(it => it.id !== id);
            localStorage.setItem("clothingItems", JSON.stringify(items));
            renderTable();
        }
    });
});