current=`date +%s`
let "ttl=86400 * 30 * 3"
regex="^origin\/t[0-9_]+$"
for k in `git branch -r | perl -pe 's/^..(.*?)( ->.*)?$/\1/'`; do
	timestamp=`git show --pretty=format:"%ct" $k -- | head -n 1`;
	branch=$k;
	let "diff=$current - $timestamp"
	if [ "$diff" -gt "$ttl" ]; then
		if [[ $branch =~ $regex ]]; then
			branchname=`echo $branch | cut -d'/' -f 2`;

			if [ $1 ]; then
				echo "Branch $branch will be deleted"
			else
				echo "Deleting $branch"
				git push origin :$branchname
			fi
		fi
	fi
done
