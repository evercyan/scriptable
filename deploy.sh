#/bin/bash
# githubusercontent dns 污染, 移动端无法绑定 host, 故下载文件等使用 gitee 替代

# ---- generate `loader.scriptable`
# file="loader.scriptable"
# echo '' > $file
# echo '{' >> $file
# echo '    "name": "Loader",' >> $file
# echo '    "icon": {"color": "deep-blue", "glyph": "home"},' >> $file
# echo '    "always_run_in_app" : false,' >> $file
# echo '    "share_sheet_inputs": [],' >> $file

# script=''
# IFS=''
# while read -r line
# do
#     script="${script}\\\n${line}"
# done < "loader.js"
# echo '    "script": "'$script'"' >> $file
# echo '}' >> $file

# ---- push to `github` & `gitee`
repoUrls=(
    "https://github.com/evercyan/scriptable"
    "https://gitee.com/evercyan/scriptable"
)
git add . && git commit -m 'auto'
for repoUrl in ${repoUrls[@]};
do
    echo git remote set-url origin $repoUrl
    git remote set-url origin $repoUrl
    git push origin main
done