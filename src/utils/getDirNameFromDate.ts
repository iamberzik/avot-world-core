export const getDirNameFromDate = () => {
	const currentDate = new Date()
	let currentDay = String(currentDate.getDate()).padStart(2, '0')
	let currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
	let currentYear = currentDate.getFullYear()
	return `/${currentYear}/${currentMonth}/${currentDay}`
}
