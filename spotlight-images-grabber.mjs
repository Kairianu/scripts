import * as path from 'jsr:@std/path';


const spotlightImagesDirectoryPath = path.join(
	Deno.env.get('LOCALAPPDATA'),
	'Packages',
	'Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy',
	'LocalState',
	'Assets',
);

try {
	await Deno.stat(spotlightImagesDirectoryPath);
}
catch {
	throw new Error('Spotlight images directory does not exist.');
}


function getFileNameDate() {
	const date = new Date();

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	const hour = String(date.getHours()).padStart(2, '0');
	const minute = String(date.getMinutes()).padStart(2, '0');
	const second = String(date.getSeconds()).padStart(2, '0');
	const millisecond = String(date.getMilliseconds()).padStart(3, '0');

	return `${year}-${month}-${day} ${hour}-${minute}-${second}-${millisecond}`;
}


const spotlightImagesOutputDirectoryPath = path.join(
	Deno.env.get('USERPROFILE'),
	'Downloads',
	`Spotlight Images [${getFileNameDate()}]`
);

try {
	await Deno.mkdir(spotlightImagesOutputDirectoryPath);
} catch {}


let spotlightImageIndex = 1;

for await ( const spotlightImageEntry of Deno.readDir(spotlightImagesDirectoryPath) ) {
	if ( ! spotlightImageEntry.isFile ) {
		continue;
	}

	const spotlightImagePath = path.join(spotlightImagesDirectoryPath, spotlightImageEntry.name);

	const spotlightImageOutputPath = path.join(spotlightImagesOutputDirectoryPath, spotlightImageIndex + '.jpg');

	await Deno.copyFile(spotlightImagePath, spotlightImageOutputPath);

	spotlightImageIndex++;
}


const explorerCommand = new Deno.Command('explorer', {
	args: [
		spotlightImagesOutputDirectoryPath,
	],
});

await explorerCommand.output();
