use tauri::{Manager, CustomMenuItem, Menu, Submenu};
use tauri::api::shell::open;
use std::sync::{Arc, Mutex};
use tauri::State;

#[tauri::command]
fn open_browser(app: tauri::AppHandle, url: String) {
    let shell_scope = app.shell_scope();
    open(&shell_scope, &url, None).expect("Failed to open browser");
}

#[tauri::command]
fn handle_oauth_response(state: State<'_, AppState>, data: String) {
    let mut state = state.0.lock().unwrap();
    state.user_info = Some(data);
    println!("OAuth response: {}", state.user_info.as_ref().unwrap());
}

struct AppState(Arc<Mutex<StateData>>);

struct StateData {
    user_info: Option<String>,
}

fn main() {
    let state = AppState(Arc::new(Mutex::new(StateData { user_info: None })));
    
    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![open_browser, handle_oauth_response])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
