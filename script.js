document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('carSelect');
    const infoDiv = document.getElementById('carInfo');

    function fetchCarData(brand) {
        return new Promise((resolve, reject) => {
            fetch('db.json')
                .then(res => {
                    if (!res.ok) {
                        reject(new Error(`HTTP error: ${res.status}`));
                        return;
                    }
                    return res.json();
                })
                .then(data => {
                    if (!data || !data.cars) {
                        reject(new Error('Invalid data format'));
                        return;
                    }
                    const car = data.cars.find(c => c.brand === brand);
                    if (!car) {
                        reject(new Error(`Car "${brand}" not found`));
                        return;
                    }
                    resolve(car);
                })
                .catch(err => reject(err));
        });
    }

    function displayError(message) {
        infoDiv.innerHTML = `<p style="color: red;"><strong>Error:</strong> ${message}</p>`;
    }

    function displayCar(car) {
        infoDiv.innerHTML = `
            <p><strong>Brand:</strong> ${car.brand}</p>
            <p><strong>Model:</strong> ${car.model}</p>
            <p><strong>Price:</strong> $${car.price}</p>`;
    }

    select.addEventListener('change', () => {
        const value = select.value;

        if (value === 'default') {
            infoDiv.innerHTML = 'выбери тачку';
            return;
        }

        infoDiv.innerHTML = '<p>Loading...</p>';

        fetchCarData(value)
            .then(car => displayCar(car))
            .catch(err => displayError(err.message));
    });

    // Отображаем значение по умолчанию при загрузке страницы
    if (select.value === 'default') {
        infoDiv.innerHTML = 'выбери тачку';
    }
});
