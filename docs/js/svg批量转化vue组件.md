```ts
import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { emptyDir, ensureDir } from 'fs-extra'
import glob from 'fast-glob'
import { SVG } from '@iconify/tools'
import { format } from 'prettier'
import type { BuiltInParserName } from 'prettier'

type SvgGroup = {
	prefix: string;
	suffix: string;
	files: string[];
}

const getSvgFiles = async (): Promise<SvgGroup[]> => {
	const ep = await glob('*.svg', { cwd: './svg/ep', absolute: true })
	const filled = await glob('*.svg', { cwd: './svg/ad/filled', absolute: true })
	const outlined = await glob('*.svg', { cwd: './svg/ad/outlined', absolute: true })
	const twotone = await glob('*.svg', { cwd: './svg/ad/twotone', absolute: true })
	
	return [
		{
			prefix: 'ep',
			suffix: '',
			files: ep
		},
		{
			prefix: 'ad',
			suffix: '-filled',
			files: filled
		},
		{
			prefix: 'ad',
			suffix: '-outlined',
			files: outlined
		},
		{
			prefix: 'ad',
			suffix: '-twotone',
			files: twotone
		},
	]
 }

const getSvgBody = async (content: string) => {
	const svg = new SVG(content)
	return svg.getBody()
}

const formatCode = (code: string, parser: BuiltInParserName = 'typescript') => {
	return format(code, {
		parser,
		semi: false,
		singleQuote: true,
	})
}

const transformToFile = async (groups: SvgGroup[]) => {
	const iconMap = {}
	const nameMap = {}
	for (let group of groups) {
		const { files, prefix, suffix } = group;
		let icons = ''
		let names: string[] = []
		for (let file of files) {
			const fileContent = await readFile(file, 'utf-8')
			const svgName = path.basename(file).replace('.svg', '') + suffix
			const svgBody = await getSvgBody(fileContent)
			icons += `'${svgName}': { body: '${svgBody}' },`
			names.push(svgName)
		}
		iconMap[prefix] = (iconMap[prefix] || '') + icons
		nameMap[`${prefix}:`] = (nameMap[`${prefix}:`] || []).concat(names)
	}

	const iconCode = Object.entries(iconMap).map(([k, v]) => {
		return formatCode(`
export const ${k}Icons = {
	prefix: '${k}',
	icons: {
		${v}
	},
	width: 1024,
	height: 1024,
}`)
	}).join('\n')
	writeFile(path.resolve('./dist', 'collections.ts'), iconCode, 'utf-8')

	const nameCode = formatCode(`export const IconJson = ${JSON.stringify(nameMap)}`)
	writeFile(path.resolve('./dist', 'data.ts'), nameCode, 'utf-8')

	return


	let content = ''
	for (let file of files) {
		const fileContent = await readFile(file, 'utf-8')
		const svgName = path.basename(file).replace('.svg', '') + suffix
		const svgBody = await getSvgBody(fileContent)
		content += `'${svgName}': { body: '${svgBody}' },`
	}

	const code = formatCode(`
addCollection({
	prefix: '${prefix}',
	icons: {
		${content}
	},
	width: 1024,
	height: 1024,
});`)

	return code
	// writeFile(path.resolve('./dist', 'out.js'), vue, 'utf-8')
}

const main = async () => {
  await ensureDir('./dist')
  await emptyDir('./dist')
  const svgFiles = await getSvgFiles()
  transformToFile(svgFiles)
}

main();
```
