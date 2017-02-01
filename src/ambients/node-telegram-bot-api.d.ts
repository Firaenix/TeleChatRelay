/*
 *  From https://github.com/mrpatiwi/typedgram-bot
 *  Just need the types for the telegram bot
 *
 */

interface IPollingOptions {
    timeout?: number | string
    interval?: number | string
}

interface IWebHookOptions {
    host: string
    port: number
    key?: string
    cert?: string
}

interface ITelegramBotOptions {
    webHook?: boolean | IWebHookOptions
    polling?: boolean | IPollingOptions
}

/**
 * This object represents an incoming update.
 */
interface Update {
    /**
     * The update‘s unique identifier.
     * Update identifiers start from a certain positive number and increase sequentially.
     * This ID becomes especially handy if you’re using Webhooks,
     * since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order.
     *
     * @type number
     */
    update_id: number

    /**
     * New incoming message of any kind — text, photo, sticker, etc.
     *
     * @type Message
     */
    message?: Message
}

/**
 * This object represents a Telegram user or bot.
 */
interface User {
    /**
     * Unique identifier for this user or bot
     *
     * @type number
     */
    id: number

    /**
     * User‘s or bot’s first name
     *
     * @type string
     */
    first_name: string

    /**
     * User‘s or bot’s last name
     *
     * @type string
     */
    last_name?: string

    /**
     * User‘s or bot’s username
     *
     * @type string
     */
    username?: string
}

interface GroupChat {
    /**
     * Unique identifier for this group chat
     *
     * @type number
     */
    id: number

    /**
     * Group name
     *
     * @type number
     */
    title: number
}


interface IFile {
    /**
     * Unique identifier for this file
     *
     * @type string
     */
    file_id: string

    /**
     * File size
     *
     * @type number
     */
    file_size?: number

    /**
     * Use https://api.telegram.org/file/bot<token>/<file_path> to get the file.
     *
     * @type string
     */
    file_path?: string
}

interface IMimeType extends IFile {
    /**
     * Mime type of a file as defined by sender
     *
     * @type string
     */
    mime_type?: string
}

interface IMedia extends IFile {
    /**
     * Width as defined by sender
     *
     * @type number
     */
    width: number

    /**
     * Height as defined by sender
     *
     * @type number
     */
    height: number
}

interface IThumbMedia extends IMedia {
    /**
     * Thumbnail
     *
     * @type PhotoSize
     */
    thumb?: PhotoSize
}

/**
 * This object represents one size of a photo or a file / sticker thumbnail.
 */
interface PhotoSize extends IMedia {

}

/**
 * This object represents an audio file to be treated as music by the Telegram clients.
 */
interface Audio extends IMimeType {
    /**
     * Duration of the audio in seconds as defined by sender
     *
     * @type number
     */
    duration: number

    /**
     * Performer of the audio as defined by sender or by audio tags
     *
     * @type string
     */
    performer?: string

    /**
     * Title of the audio as defined by sender or by audio tags
     *
     * @type string
     */
    title?: string
}

/**
 * This object represents a general file (as opposed to photos, voice messages and audio files).
 */
interface Document extends IMimeType, IThumbMedia {
    /**
     * Original filename as defined by sender
     *
     * @type string
     */
    file_name?: string
}

/**
 * This object represents a sticker.
 */
interface Sticker extends IThumbMedia {
    /**
     * Emoji alias for sticker
     *
     * @type string
     */
    emoji?: string
}

/**
 * This object represents a video file.
 */
interface Video extends IThumbMedia, IMimeType {
    /**
     * Duration of the video in seconds as defined by sender
     *
     * @type number
     */
    duration: number
}

interface Voice extends IMimeType {
    /**
     * Duration of the audio in seconds as defined by sender
     *
     * @type number
     */
    duration: number
}

interface Contact {
    /**
     * Contact's phone number
     *
     * @type string
     */
    phone_number: string

    /**
     * Contact's first name
     * @type string
     */
    first_name: string

    /**
     *  Contact's last name
     *
     * @type string
     */
    last_name?: string

    /**
     * Contact's user identifier in Telegram
     *
     * @type number
     */
    user_id?: number
}

interface Location {
    /**
     * Longitude as defined by sender
     *
     * @type number
     */
    longitude: number

    /**
     * Latitude as defined by sender
     *
     * @type number
     */
    latitude: number
}

interface UserProfilePhotos {
    /**
     * Total number of profile pictures the target user has
     *
     * @type number
     */
    total_count: number

    /**
     * Requested profile pictures (in up to 4 sizes each)
     *
     * @type PhotoSize[][]
     */
    photos: PhotoSize[][]
}

interface Message {
    /**
     * Unique message identifier
     *
     * @type number
     */
    message_id: number

    /**
     * Sender
     *
     * @type User
     */
    from: User

    /**
     * Date the message was sent in Unix time
     *
     * @type number
     */
    date: number

    /**
     * Conversation the message belongs to — user in case of a private message, [[GroupChat]] in case of a group
     *
     * @type User | GroupChat
     */
    chat: User | GroupChat

    /**
     * For forwarded messages, sender of the original message
     *
     * @type User
     */
    forward_from?: User

    /**
     * For forwarded messages, date the original message was sent in Unix time
     *
     * @type number
     */
    forward_date?: number

    /**
     * For replies, the original message.
     * Note that the [[Message]] object in this field will not contain further reply_to_message fields even if it itself is a reply.
     *
     * @type Message
     */
    reply_to_message?: Message

    /**
     * For text messages, the actual UTF-8 text of the message
     *
     * @type string
     */
    text?: string

    /**
     * Message is an audio file, information about the file
     *
     * @type Audio
     */
    audio?: Audio

    /**
     * Message is an general file, information about the file
     *
     * @type Document
     */
    document?: Document

    /**
     * Message is a photo, available sizes of the photo
     *
     * @type PhotoSize[]
     */
    photo?: PhotoSize[]

    /**
     * Message is a sticker, information about the sticker
     *
     * @type Sticker
     */
    sticker?: Sticker

    /**
     * Message is a video, information about the video
     *
     * @type Video
     */
    video?: Video

    /**
     * Message is a voice message, information about the file
     *
     * @type Voice
     */
    voice?: Voice

    /**
     * Caption for the photo or video
     *
     * @type string
     */
    caption?: string

    /**
     * Message is a shared contact, information about the contact
     *
     * @type Contact
     */
    contact?: Contact

    /**
     * Message is a shared location, information about the location
     *
     * @type Location
     */
    location?: Location

    /**
     * A new member was added to the group, information about them (this member may be bot itself)
     *
     * @type User
     */
    new_chat_participant?: User

    /**
     * A new member was added to the group, information about them (this member may be bot itself)
     *
     * @type User
     */
    left_chat_participant?: User

    /**
     * A group title was changed to this value
     *
     * @type string
     */
    new_chat_title?: string

    /**
     * A group photo was change to this value
     *
     * @type PhotoSize[]
     */
    new_chat_photo?: PhotoSize[]

    /**
     * Informs that the group photo was deleted
     *
     * @type boolean
     */
    delete_chat_photo?: boolean

    /**
     * Informs that the group has been created
     *
     * @type boolean
     */
    group_chat_created?: boolean
}

interface IKeyboard {
    /**
     * Use this parameter if you want to show the keyboard to specific users only.
     * Targets:
     *     1) users that are @mentioned in the text of the Message object;
     *     2) if the bot's message is a reply (has reply_to_message_id), sender of the original message.
     *
     * Example: A user requests to change the bot‘s language,
     * bot replies to the request with a keyboard to select the new language.
     * Other users in the group don’t see the keyboard.
     *
     * @type boolean
     */
    selective?: boolean
}

/**
 * This object represents a custom keyboard with reply options.
 * See Introduction to bots for details and examples: https://core.telegram.org/bots#keyboards
 */
interface IReplyKeyboardMarkup extends IKeyboard {
    /**
     * Array of button rows, each represented by an Array of Strings
     *
     * @type string[][]
     */
    keyboard: string[][]

    /**
     * Requests clients to resize the keyboard vertically for optimal fit
     * (e.g., make the keyboard smaller if there are just two rows of buttons).
     *
     * Defaults to false, in which case the custom keyboard is always of the same height as the app's standard keyboard.
     *
     * @type boolean
     */
    resize_keyboard?: boolean

    /**
     * Requests clients to hide the keyboard as soon as it's been used.
     *
     * Defaults to false.
     *
     * @type boolean
     */
    one_time_keyboard?: boolean
}

/**
 * Upon receiving a message with this object, Telegram clients will hide the
 * current custom keyboard and display the default letter-keyboard.
 *
 * By default, custom keyboards are displayed until a new keyboard is sent by a bot.
 * An exception is made for one-time keyboards that are hidden immediately after the user presses a button (see [[ReplyKeyboardMarkup]]).
 */
interface IReplyKeyboardHide extends IKeyboard {
    /**
     * Requests clients to hide the custom keyboard
     *
     * @type boolean
     */
    hide_keyboard: boolean
}

/**
 * Upon receiving a message with this object, Telegram clients will display a reply interface to the user
 * (act as if the user has selected the bot‘s message and tapped ’Reply').
 *
 * This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice privacy mode.
 */
interface IForceReply extends IKeyboard {
    /**
     * Shows reply interface to the user, as if they manually selected the bot‘s message and tapped ’Reply'
     *
     * @type boolean
     */
    force_reply: boolean
}

interface IReplyOptions {
    /**
     * If the message is a reply, ID of the original message
     *
     * @type number
     */
    reply_to_message_id?: number

    /**
     * Additional interface options.
     * A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
     *
     * @type IReplyKeyboardMarkup | IReplyKeyboardHide | IForceReply
     */
    reply_markup?: IReplyKeyboardMarkup | IReplyKeyboardHide | IForceReply | string
}

interface ISendMessageOptions extends IReplyOptions {
    /**
     * Send Markdown, if you want Telegram apps to show bold, italic and inline URLs in your bot's message.
     *
     * @type string
     */
    parse_mode?: string

    /**
     * Disables link previews for links in this message
     *
     * @type boolean
     */
    disable_web_page_preview?: boolean
}

interface ISendPhotoOptions extends IReplyOptions {
    /**
     * Photo caption (may also be used when resending photos by file_id).
     *
     * @type string
     */
    caption?: string
}

interface ISendAudioOptions extends IReplyOptions {
    /**
     * Duration of the audio in seconds
     *
     * @type number
     */
    duration?: number

    /**
     * Performer
     *
     * @type string
     */
    performer?: string

    /**
     * Track name
     *
     * @type string
     */
    title?: string
}

interface ISendVideoOptions extends IReplyOptions {
    /**
     * Video caption (may also be used when resending videos by file_id).
     *
     * @type string
     */
    caption?: string

    /**
     * Duration of sent video in seconds
     * @type number
     */
    duration?: number
}

interface ISendVoiceOptions extends IReplyOptions {
    /**
     * Duration of sent audio in seconds
     *
     * @type number
     */
    duration?: number
}

interface IQs {
    qs: IReplyOptions
}

declare module 'node-telegram-bot-api' {
    import {Stream} from 'stream';

    type idType = number | string
    type fileType = string | Stream

    class TelegramBot {
        /**
         * Both request method to obtain messages are implemented. To use standard polling, set polling: true on options.
         * Notice that webHook will need a valid SSL certificate (self-signed certificates are allowed since August 29, 2015).
         * Emits message when a message arrives.
         *
         * See: https://core.telegram.org/bots/api
         *
         * @param  {string}              token   Bot token.
         * @param  {ITelegramBotOptions} options Bot options.
         * @return {TelegramBot}                      Instance of a bot.
         */
        public constructor(token: string, options: ITelegramBotOptions)

        public on(event: string, action: (msg: Message) => any): Promise<Message>
        protected _request(path: string, options: IQs): Promise<Message>

        /**
         * Use this method to specify a url and receive incoming updates via an outgoing webhook.
         * Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url,
         * containing a JSON-serialized [[Update]].
         *
         * In case of an unsuccessful request, we will give up after a reasonable amount of attempts.
         *
         * If you'd like to make sure that the Webhook request comes from Telegram,
         * we recommend using a secret path in the URL, e.g. https://www.example.com/<token>.
         * Since nobody else knows your bot‘s token, you can be pretty sure it’s us.
         *
         * See: https://core.telegram.org/bots/api#setwebhook
         *
         * @param {string} url URL where Telegram will make HTTP Post. Leave empty to delete webHook.
         */
        public setWebHook(url?: string): void

        /**
         * Use this method to receive incoming updates using long polling.
         * An Array of [[Update]] objects is returned.
         *
         * See: https://core.telegram.org/bots/api#getupdates
         *
         * @param  {idType}          timeout Timeout in seconds for long polling.
         * @param  {idType}          limit   Limits the number of updates to be retrieved.
         * @param  {idType}          offset  Identifier of the first update to be returned.
         * @return {Promise<[Update]>}         Updates
         */
        public getUpdates(timeout?: idType, limit?: idType, offset?: idType): Promise<[Update]>

        /**
         * A simple method for testing your bot's auth token. Requires no parameters.
         * Returns basic information about the bot in form of a [[User]] object.
         *
         * See: https://core.telegram.org/bots/api#getme
         *
         * @return {Promise<User>} Promise with the bot as Telegram user.
         */
        public getMe(): Promise<User>

        /**
         * Use this method to send text messages. On success, the sent [[Message]] is returned.
         *
         * See: https://core.telegram.org/bots/api#sendmessage
         *
         * @param  {idType}              chatId  Unique identifier for the message recipient — [[User]] or [[GroupChat]] id
         * @param  {string}              text    Text of the message to be sent
         * @param  {ISendMessageOptions} options Additional Telegram query options
         * @return {Promise<Message>}            Send operation promise
         */
        public sendMessage(chatId: idType, text: string, options?: ISendMessageOptions): Promise<Message>

        /**
         * Use this method to send photos. On success, the sent [[Message]] is returned.
         *
         * See: https://core.telegram.org/bots/api#sendphoto
         *
         * @param  {idType}            chatId  Unique identifier for the message recipient — [[User]] or [[GroupChat]] id
         * @param  {fileType}          photo   A file path or a Stream. Can also be a file_id previously
         * @param  {ISendPhotoOptions} options Additional Telegram query options
         * @return {Promise<Message>}          Send operation promise
         */
        public sendPhoto(chatId: idType, photo: fileType, options?: ISendPhotoOptions): Promise<Message>

        /**
         * Use this method to send audio files, if you want Telegram clients to display them in the music player.
         * Your audio must be in the .mp3 format.
         *
         * On success, the sent [[Message]] is returned.
         *
         * Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
         *
         * For backward compatibility, when the fields title and performer are both empty and
         * the mime-type of the file to be sent is not audio/mpeg, the file will be sent as a playable voice message.
         * For this to work, the audio must be in an .ogg file encoded with OPUS.
         * This behavior will be phased out in the future. For sending voice messages, use the [[sendVoice]] method instead.
         *
         * See: https://core.telegram.org/bots/api#sendaudio
         *
         * @param  {idType}            chatId  Unique identifier for the message recipient — [[User]] or [[GroupChat]] id
         * @param  {fileType}          audio   A file path or a Stream. Can also be a file_id previously
         * @param  {ISendAudioOptions} options Additional Telegram query options
         * @return {Promise<Message>}          Send operation promise
         */
        public sendAudio(chatId: idType, audio: fileType, options?: ISendAudioOptions): Promise<Message>

        /**
         * Use this method to send general files. On success, the sent [[Message]] is returned.
         * Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
         *
         * See: https://core.telegram.org/bots/api#senddocument
         *
         * @param  {idType}            chatId   Unique identifier for the message recipient — [[User]] or [[GroupChat]] id
         * @param  {fileType}          document A file path or a Stream. Can also be a file_id previously
         * @param  {IReplyOptions}     options  Additional Telegram query options
         * @return {Promise<Message>}           Send operation promise
         */
        public sendDocument(chatId: idType, document: fileType, options?: IReplyOptions): Promise<Message>

        /**
         * Use this method to send .webp stickers. On success, the sent [[Message]] is returned.
         *
         * See: https://core.telegram.org/bots/api#sendsticker
         *
         * @param  {idType}            chatId  Unique identifier for the message recipient — [[User]] or [[GroupChat]] id
         * @param  {fileType}          sticker A file path or a Stream. Can also be a file_id previously
         * @param  {IReplyOptions}     options Additional Telegram query options
         * @return {Promise<Message>}          Send operation promise
         */
        public sendSticker(chatId: idType, sticker: fileType, options?: IReplyOptions): Promise<Message>

        /**
         * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as [[Document]]).
         * On success, the sent [[Message]] is returned. Bots can currently send video files of up to 50 MB in size,
         * this limit may be changed in the future.
         *
         * See: https://core.telegram.org/bots/api#sendvideo
         *
         * @param  {idType}            chatId  Unique identifier for the message recipient — [[User]] or [[GroupChat]] id
         * @param  {fileType}          video   A file path or a Stream. Can also be a file_id previously
         * @param  {ISendVideoOptions} options Additional Telegram query options
         * @return {Promise<Message>}          Send operation promise
         */
        public sendVideo(chatId: idType, video: fileType, options?: ISendVideoOptions): Promise<Message>

        /**
         * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message.
         * For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as [[Audio]] or [[Document]]).
         * On success, the sent [[Message]] is returned.
         * Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
         *
         * See: https://core.telegram.org/bots/api#sendvoice
         *
         * @param  {idType}            chatId  Unique identifier for the message recipient — [[User]] or [[GroupChat]] id
         * @param  {fileType}          voice   A file path or a Stream. Can also be a file_id previously
         * @param  {ISendVoiceOptions} options Additional Telegram query options
         * @return {Promise<Message>}          Send operation promise
         */
        public sendVoice(chatId: idType, voice: fileType, options?: ISendVoiceOptions): Promise<Message>

        /**
         * Use this method to send point on the map. On success, the sent [[Message]] is returned.
         *
         * See: https://core.telegram.org/bots/api#sendlocation
         *
         * @param  {idType}           chatId    Unique identifier for the message recipient — [[User]] or [[GroupChat]] id
         * @param  {number}           latitude  Latitude of location
         * @param  {number}           longitude Longitude of location
         * @param  {IReplyOptions}    options Additional Telegram query options
         * @return {Promise<Message>}          Send operation promise
         */
        public sendLocation(chatId: idType, latitude: number, longitude: number, options?: IReplyOptions): Promise<Message>

        /**
         * Use this method to forward messages of any kind. On success, the sent [[Message]] is returned.
         *
         * See: https://core.telegram.org/bots/api#forwardmessage
         *
         * @param  {idType}           chatId     Unique identifier for the message recipient — [[User]] or [[GroupChat]] id
         * @param  {idType}           fromChatId Unique identifier for the chat where the original message was sent
         * @param  {idType}           messageId  Unique message identifier
         * @return {Promise<Message>}            Send operation promise
         */
        public forwardMessage(chatId: idType, fromChatId: idType, messageId: idType): Promise<Message>

        /**
         * Use this method when you need to tell the user that something is happening on the bot's side.
         * The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status).
         *
         * See: https://core.telegram.org/bots/api#sendchataction
         *
         * @param {idType} chatId Unique identifier for the message recipient — [[User]] or [[GroupChat]] id
         * @param {string} action Type of action to broadcast.
         */
        public sendChatAction(chatId: idType, action: string): void

        /**
         * Use this method to get a list of profile pictures for a user. Returns a [[UserProfilePhotos]] object.
         *
         * See: https://core.telegram.org/bots/api#getuserprofilephotos
         *
         * @param {idType} chatId Unique identifier for the message recipient — [[User]] or [[GroupChat]] id
         * @param  {number}                     offset     Sequential number of the first photo to be returned.
         *                                                 By default, all photos are returned.
         * @param  {number}                     limit      Limits the number of photos to be retrieved.
         *                                                 Values between 1—100 are accepted. Defaults to 100.
         * @return {Promise<UserProfilePhotos>}            [[UserProfilePhotos]] object
         */
        public getUserProfilePhotos(userId: idType, offset?: number, limit?: number): Promise<UserProfilePhotos>

        /**
         * Use this method to get basic info about a file and prepare it for downloading.
         * Attention: link will be valid for 1 hour.
         *
         * @param  {string}         fileId File identifier to get info about
         * @return {Promise<IFile>}        [[IFile]] object with [[file_path]]
         */
        public getFile(fileId: string): Promise<IFile>;

        /**
         * Use this method to get link for file for subsequent use.
         * Attention: link will be valid for 1 hour.
         *
         * This method is a sugar extension of the [[getFile]] method.
         * Which returns just path to file on remote server (you will have to manually build full uri after that).
         *
         * @param  {string}          fileId File identifier to get info about
         * @return {Promise<string>}        Promise which will have *fileURI* in resolve callback
         */
        public getFileLink(fileId: string): Promise<string>;

        /**
         * Downloads file in the specified folder.
         * This is just a sugar for [[getFile]] method.
         *
         * @param  {string}          fileId      File identifier to get info about
         * @param  {string}          downloadDir Absolute path to the folder in which file will be saved
         * @return {Promise<string>}             Will have filePath of downloaded file in resolve callback
         */
        public downloadFile(fileId: string, downloadDir: string): Promise<string>
    }

    export = TelegramBot;
}