export interface IMarkerGroupRaw {
    gid: number,
    gIcon: number,
    ms: IMarkerRaw[]
    gName: string,
    hCol?: number, // Group Highlight Color
}

export interface IMarkerRaw {
    x: number,
    y: number,
    uid: number, // Unique ID
    lms?: number[], // Linked Markers UID
    st: string, // Subtitle
    des?: string, // Description
}

export interface IMarker {
    pos: {x: number, y:number},
    title: string,
    subtitle: string,
    description?: string,
    icon_path: string,
    highlight_color?: string,

    marker_id: number,
    group_id: number,

    linked_markers?: number[],
}

export interface IMarkerGroup {
    group_id: number,
    name: string,
    icon_path: string,
    markers: number[],
    highlight_color?: string,
}

export const EIconId = [
    "fairyStaff.webp",              //0
    "spiritTree.webp",              //1
    "teleport_standard.webp",       //2
    "teleport_arceuus.webp",        //3
    "teleport_ancient.webp",        //4
    "teleport_lunar.webp",          //5
    "house.webp",                   //6
    "sailing.webp",                 //7
    "quetzal.webp",                 //8
    "acc_glory.webp",               //9
    "acc_skills.webp",              //10
    "acc_games.webp",               //11
    "acc_digsite.webp",             //12
    "acc_passage.webp",             //13
    "acc_burning.webp",             //14
    "acc_combat.webp",              //15
    "acc_dueling.webp",             //16
    "acc_wealth.webp",              //17
    "acc_slayer.webp",              //18
    "shantay.webp",                 //19
]
export const EIconHighlightColor = [
    "rgba(208, 193, 0, 255)",       //0
    "rgba(239,118,39,255)",         //1
    "rgba(74, 129, 35, 255)",       //2
    "rgba(0, 56, 168, 255)",        //3
    "rgba(33,177,255,255)",         //4
    "rgba(214,2,112,255)",          //5
    "rgba(163,2,98,255)",           //6
    "rgba(148, 2, 2, 255)",         //7
    "rgba(97, 57, 21, 255)"         //8
]

import MARKERS from './mlist.json'
import MARKERS_2 from './mlist_2.json'
import MARKERS_3 from './mlist_3.json'
export function createMarkerList() {
    // @ts-ignore
    const markerListRaw = [...MARKERS, ...MARKERS_2, ...MARKERS_3] as IMarkerGroupRaw[]
    const markerArray = [] as IMarker[]
    const groupArray = [] as IMarkerGroup[]

    for (const group of markerListRaw) {
        const markers = group.ms
        const newGroup: IMarkerGroup = {
            group_id: group.gid,
            name: group.gName,
            icon_path: EIconId[group.gIcon],
            highlight_color: group.hCol != undefined ? EIconHighlightColor[group.hCol] : undefined,
            markers: []
        }
        for (const marker of markers) {
            markerArray.push({
                pos: {x: marker.x, y: marker.y},
                title: group.gName,
                subtitle: marker.st,
                description: marker.des,
                icon_path: EIconId[group.gIcon],
                highlight_color: group.hCol != undefined ? EIconHighlightColor[group.hCol] : undefined,
                marker_id: marker.uid,
                group_id: group.gid,
                linked_markers: marker.lms
            })
            newGroup.markers.push(marker.uid)
        }
        groupArray.push(newGroup)
    }

    return {groups: groupArray, markers: markerArray}
}
// Missing Markers: Fairy Rings: ALR, BJR, BKQ, BLQ, CKP, DIP, DIQ, DIR