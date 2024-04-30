// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::api::dialog;

// fn open_folder_dialog() -> String {
//     let result = dialog::open().directory().show_directories_only(true).run()?;
//     Ok(result)
// }

fn main() {
    tauri::Builder::default()
        // .invoke_handler(tauri::generate_handler![open_folder_dialog])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
