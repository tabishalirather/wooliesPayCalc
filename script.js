console.log('cnntd')
document.getElementById('calculateButton').addEventListener('click', calculateEarnings);
document.addEventListener('DOMContentLoaded', function () {
	const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	days.forEach(day => {
		const checkbox = document.getElementById(`${day}Checkbox`);
		const startTime = document.querySelector(`#${day} .start-time`);
		const endTime = document.querySelector(`#${day} .end-time`);

		checkbox.addEventListener('change', function () {
			if (this.checked) {
				startTime.style.display = 'inline-block';
				endTime.style.display = 'inline-block';
			} else {
				startTime.style.display = 'none';
				endTime.style.display = 'none';
			}
		});
	});
});
document.addEventListener('DOMContentLoaded', function () {
	const baseRateInput = document.getElementById('baseRate');
	const employmentTypeSelect = document.getElementById('employmentType');
	const daysInputDiv = document.querySelector('.days-input');
	const calculateButton = document.getElementById('calculateButton');
	const resultDiv = document.querySelector('.result');

	function checkAndScrollToDays() {
		if (baseRateInput.value && employmentTypeSelect.value) {
			daysInputDiv.scrollIntoView({ behavior: 'smooth' });
		}
	}

	baseRateInput.addEventListener('input', checkAndScrollToDays);
	employmentTypeSelect.addEventListener('change', checkAndScrollToDays);

	calculateButton.addEventListener('click', function () {
		resultDiv.scrollIntoView({ behavior: 'smooth' });
	});
});

document.getElementById('calculateButton').addEventListener('click', function () {
	// Call the calculateEarnings function
	calculateEarnings();

	// Show the modal
	const modal = document.getElementById('earningsModal');
	modal.style.display = "block";

	// Close the modal when the close button is clicked
	document.querySelector('.close-btn').onclick = function () {
		modal.style.display = "none";
	};

	// Close the modal when clicking outside of the modal content
	window.onclick = function (event) {
		if (event.target === modal) {
			modal.style.display = "none";
		}
	};
});


function calculateDailyEarnings(employmentType, baseRate, day, startTime, endTime) {
	console.log('cnntd3')
	let dailyEarnings = 0;

	function getPenaltyRate(employmentType, day, hour) {
		if (employmentType === 'part-time') {
			if (day === 'sunday') {
				// if (hour < 9) return baseRate * 1.0;
				// if (hour < 21) return baseRate * 0.5;
				return baseRate * 0.75;
			} else if (day === 'saturday') {
				if (hour < 23) return baseRate * 0.25;
			} else {
				if (hour < 7) {
					if (hour < 4) return baseRate * 0.5;
					return baseRate * 1.0;
				}
				if (hour < 18) return 0;
				if (hour < 23) return baseRate * 0.25;
				if (hour < 24) return baseRate * 0.5;
			}
		} else {
			if (day === 'sunday') {
				if (hour < 9) return baseRate * 1.25;
				if (hour < 21) return baseRate * 0.75;
				return baseRate * 1.25;
			} else if (day === 'saturday') {
				return baseRate * 0.5;
			} else {
				if (hour < 7) {
					if (hour < 4) return baseRate * 0.7;
					return baseRate * 1.25;
				}
				if (hour < 18) return baseRate * 0.25;
				if (hour < 23) return baseRate * 0.5;
				if (hour < 24) return baseRate * 0.7;
			}
		}
		return 0; // Base rate by default
	}

	for (let current = startTime; current < endTime; current.setHours(current.getHours() + 1)) {
		const hour = current.getUTCHours();
		dailyEarnings += baseRate + getPenaltyRate(employmentType, day, hour);
	}


	return dailyEarnings;
}
function calculateEarnings() {
	const employmentType = document.getElementById('employmentType').value;
	const baseRate = parseFloat(document.getElementById('baseRate').value);
	let totalEarnings = 0;

	const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	for (const day of days) {
		if (document.getElementById(day + 'Checkbox').checked) {
			const startTime = new Date('1970-01-01T' + document.querySelector(`#${day} .start-time`).value + 'Z');
			const endTime = new Date('1970-01-01T' + document.querySelector(`#${day} .end-time`).value + 'Z');
			console.log('inside')
			// console.log(totalEarnings)
			totalEarnings += calculateDailyEarnings(employmentType, baseRate, day, startTime, endTime);
			console.log(totalEarnings)
		}
	}

	document.getElementById('weeklyEarnings').innerText = `${totalEarnings}`;
	console.log('cnntd2')
}
