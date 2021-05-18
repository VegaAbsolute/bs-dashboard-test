// TODO: change algorythm for read ' and " via one loop
const removeComentsFromLoraGlobalConf = (text, startSubstring, finishSubstring) => {
	let textLength = text.length;
	let finishSubstringLength = finishSubstring.length;

	let resultText = text;

	for(var i = 0; i < textLength; i++) {
		const indexStart = resultText.indexOf(startSubstring);
		const indexFinish = resultText.indexOf(finishSubstring);

		if (indexStart > -1 && indexFinish > -1) {
			resultText = resultText.substring(0, indexStart) + resultText.substring(indexFinish + finishSubstringLength);
		} else {
			break;
		}
	}
	// TODO: delete console.log();
	//console.log(`count of comments = ${i}`);
	return resultText;
}

exports.removeComentsFromLoraGlobalConf = removeComentsFromLoraGlobalConf;
