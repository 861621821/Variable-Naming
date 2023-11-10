const vscode = require('vscode');
const md5 = require('md5');

const url = 'https://fanyi-api.baidu.com/api/trans/vip/translate';

module.exports = class Translater {
    // 调用百度翻译api
    constructor() {
        this.appid = '20231107001872557';
        this.scretkey = 'Pvn4mFBlDeWW878F8DJm';
    }

    async translate(selectText) {
        let text = '';
        // 如果是中文，翻译成英文 否则跳过翻译
        if (!/[\u4e00-\u9fa5]/.test(selectText)) {
            this.initOptions(selectText);
            return;
        }
        const salt = Math.floor(Date.now() / 1000);
        // 签名
        const sign = md5(`${this.appid}${selectText}${salt}${this.scretkey}`);
        try {
            const res = await fetch(`${url}?q=${encodeURIComponent(selectText)}&from=zh&to=en&appid=${this.appid}&salt=${salt}&sign=${sign}`);
            const { trans_result } = await res.json();
            if (trans_result && trans_result.length) {
                text = trans_result[0].dst.toLowerCase();
            }
            this.initOptions(text);
        } catch (error) {
            vscode.window.showInformationMessage('网络异常！');
        }
    }

    initOptions(text) {
        const options = [
            {
                label: text,
                description: '',
            },
            {
                label: this.capitalize(text),
                description: '',
            },
            {
                label: this.camelCase(text),
                description: '',
            },
            {
                label: this.pascalCase(text),
                description: '',
            },
            {
                label: this.underScore(text),
                description: '',
            },
            {
                label: this.kebabCase(text),
                description: '',
            },
            {
                label: this.upperCase(text),
                description: '',
            },
            {
                label: this.constant(text),
                description: '',
            },
            {
                label: this.noSpace(text),
                description: '',
            },
            {
                label: this.noSpaceUpperCase(text),
                description: '',
            },
        ];
        this.createQuickPick(options);
    }

    createQuickPick(options) {
        // 创建QuickPick对象
        const quickPick = vscode.window.createQuickPick();
        // 设置选项
        quickPick.items = options;
        quickPick.placeholder = '选择并替换';

        // 显示选项列表
        quickPick.show();

        // 处理用户选择
        quickPick.onDidChangeSelection((selection) => {
            if (selection[0]) {
                const selectedOption = selection[0];
                const editor = vscode.window.activeTextEditor;

                if (editor) {
                    const selectionRange = editor.selection;

                    // 替换选中文本
                    editor.edit((editBuilder) => {
                        editBuilder.replace(selectionRange, selectedOption.label);
                    });
                }
            }
            quickPick.dispose();
        });
    }

    // 所有单词首字母大写
    capitalize(text) {
        return text.replace(/\b[a-z]/g, (match) => match.toUpperCase());
    }

    // 小驼峰
    camelCase(text) {
        return text.replace(/[-_\s]+(.)?/g, (match, c) => (c ? c.toUpperCase() : ''));
    }

    // 大驼峰
    pascalCase(text) {
        return this.capitalize(this.camelCase(text));
    }

    // 连起来无空格
    noSpace(text) {
        return text.replaceAll(' ', '');
    }

    // 大写连起来无空格
    noSpaceUpperCase(text) {
        return this.noSpace(text).toUpperCase();
    }

    // 下划线
    underScore(text) {
        return text.replaceAll(' ', '_').toLowerCase();
    }

    // 中划线
    kebabCase(text) {
        return text.replaceAll(' ', '-').toLowerCase();
    }

    // 大写
    upperCase(text) {
        return text.toUpperCase();
    }

    // 大写下划线
    constant(text) {
        return this.underScore(text).toUpperCase();
    }
};
