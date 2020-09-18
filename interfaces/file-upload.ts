// Custom interface on image upload data
export interface FileUpload {
    name: string,
    data: any,
    encoding: string,
    size: number,
    tempFilePath: string,
    truncated: boolean,
    mimetype: string,
    md5: string
}