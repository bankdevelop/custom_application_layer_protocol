let handler = module.exports;

handler.extract_header() = (data) => {
    let lines = data.split('\n');
    let method = lines[0].trim().split(':')[1].trim.toLowerCase();
    if (method === 'connection'){
        return handleMethodConnection(lines);
    } else if (method === 'insert'){
        return handleMethodInsert(lines)
    } else if (method === 'message'){
        return handleMethodMessage(lines)
    }
}

function handleMethodConnection(){

}

function handleMethodInsert(){

}

function handleMethodMessage(){
    
}