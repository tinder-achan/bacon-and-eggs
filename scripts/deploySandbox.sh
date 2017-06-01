
{
    eb create $CIRCLE_BRANCH --cfg sandboxes
} || {
    echo "env already exists"
}

eb deploy $CIRCLE_BRANCH